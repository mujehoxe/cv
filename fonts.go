package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"slices"
	"strings"

	"github.com/adrg/sysfont"

	"github.com/ConradIrwin/font/sfnt"
)

type Font struct {
	Name   string `json:"name"`
	Path   string `json:"path"`
	Family string `json:"family"`
}

const configPath = "./cvApp.config.json"

type Config struct {
	DefaultFont string `json:"defaultFont"`
	// Add other fields as necessary
}

var finder = sysfont.NewFinder(nil)
var acceptableExtentions = []string{".ttf"}

func (a *App) GetAllFonts() []Font {
	fonts := make([]Font, 0)

	for _, f := range finder.List() {
		if !slices.Contains(acceptableExtentions, filepath.Ext(f.Filename)) {
			continue
		}

		file, err := os.Open(f.Filename)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Failed to open font: %s\n", err)
		}
		defer file.Close()

		font, err := sfnt.Parse(file)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Failed to parse font: %s\n", err)
		}

		info, err := getFontInfo(font)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Failed to get font info: %s\n", err)
			continue
		}

		result := Font{
			Path: f.Filename,
		}

		name, exists := info["Full Name"]
		if exists {
			result.Name = name
		}

		family, exists := info["Preferred Family"]
		if !exists {
			family, exists = info["Font Family"]
			if !exists {
				fmt.Printf("No Font Family found for font: %s\n", f.Filename)
				continue
			}
		}

		result.Family = family

		fonts = append(fonts, result)
	}

	return fonts
}

func (a *App) GetDefaultFont() string {
	font := "Arial"

	data, err := os.ReadFile(configPath)
	if err != nil {
		log.Printf("Error reading file: %s", err)
		return font
	}

	var config Config
	err = json.Unmarshal(data, &config)
	if err != nil {
		log.Printf("Error parsing JSON: %s", err)
		return font
	}

	if config.DefaultFont != "" {
		return config.DefaultFont
	}

	return font
}

func (a *App) SetDefaultFont(font string) (err error) {
	data, err := os.ReadFile(configPath)
	if err != nil {
		return fmt.Errorf("error reading file: %s", err)
	}

	var config Config
	err = json.Unmarshal(data, &config)
	if err != nil {
		return fmt.Errorf("error parsing JSON: %s", err)
	}

	config.DefaultFont = font

	data, err = json.Marshal(config)
	if err != nil {
		return fmt.Errorf("error marshalling JSON: %s", err)
	}

	err = os.WriteFile(configPath, data, 0644)
	if err != nil {
		return fmt.Errorf("error writing file: %s", err)
	}

	return nil
}

func getFontInfo(font *sfnt.Font) (map[string]string, error) {
	m := make(map[string]string)
	if !font.HasTable(sfnt.TagName) {
		return nil, errors.New("font does not contain name table")
	}

	name, err := font.NameTable()
	if err != nil {
		return nil, err
	}

	for _, entry := range name.List() {
		_, exists := m[entry.Label()]
		if !exists {
			m[entry.Label()] = entry.String()
		}
	}

	return m, nil
}

func MatchFont(family string, weight string) (path string, err error) {
	for _, f := range finder.List() {
		if !slices.Contains(acceptableExtentions, filepath.Ext(f.Filename)) {
			continue
		}

		file, err := os.Open(f.Filename)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Failed to open font: %s\n", err)
		}
		defer file.Close()

		font, err := sfnt.Parse(file)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Failed to parse font: %s, %s\n", err, f.Filename)
			continue
		}

		info, err := getFontInfo(font)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Failed to get font info: %s\n", err)
			continue
		}

		if strings.EqualFold(family, info["Preferred Family"]) ||
			strings.EqualFold(family, info["Font Family"]) {
			if strings.EqualFold(weight, info["Font Subfamily"]) ||
				(weight == "" && info["Font Subfamily"] == "Regular") {
				return f.Filename, nil
			}
		}
	}

	return "", errors.New("no match found")
}
