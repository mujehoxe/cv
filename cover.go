package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"path/filepath"
	"strconv"
	"time"

	"github.com/jung-kurt/gofpdf"
)

type CoverLetterInfo struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Birthday  struct {
		Date     string `json:"date"`
		DateType string `json:"dateType"`
	} `json:"birthday"`
	Email        string `json:"email"`
	PhoneNumbers []struct {
		PhoneNumber string `json:"phoneNumber"`
		PhonePrefix struct {
			CountryCode string `json:"countryCode"`
			Prefix      int    `json:"prefix"`
		}
		CustomPhoneNumberType string `json:"customPhoneNumberType"`
		PhoneNumberType       string `json:"phoneNumberType"`
	} `json:"phones"`
	Street   string `json:"street"`
	City     string `json:"city"`
	Zip      string `json:"zip"`
	Country  string `json:"country"`
	Object   string `json:"object"`
	Content  string `json:"content"`
	Language string `json:"language"`
	Font     Font   `json:"font"`
}

// GenerateCoverLetter generates a cover letter from the given JSON data
func (a *App) GenerateCoverLetter(jsonData string) (string, error) {
	var data CoverLetterInfo

	err := json.Unmarshal([]byte(jsonData), &data)
	if err != nil {
		return "", fmt.Errorf("failed to unmarshal json data: %w", err)
	}

	fileName, err := generateAndSaveCoverLetter(data)
	if err != nil {
		return "", fmt.Errorf("failed to generate and save cover letter: %w", err)
	}

	return fileName, nil
}

// create map for translating lables to four languages (english, german, french and spanish)
var languageMap = map[string]map[string]string{
	"Name":        {"EN": "Name", "DE": "Name", "FR": "Nom", "ES": "Nombre"},
	"Birthday":    {"EN": "Birthday", "DE": "Geburtstag", "FR": "Date DE naissance", "ES": "Fecha DE nacimiento"},
	"Email":       {"EN": "Email", "DE": "E-Mail", "FR": "Courriel", "ES": "Correo electrónico"},
	"Phone":       {"EN": "Phone", "DE": "Telefon", "FR": "Téléphone", "ES": "Teléfono"},
	"Address":     {"EN": "Address", "DE": "Adresse", "FR": "Adresse", "ES": "Dirección"},
	"Subject":     {"EN": "Subject", "DE": "Betreff", "FR": "Sujet", "ES": "Asunto"},
	"CoverLetter": {"EN": "Cover Letter", "DE": "Bewerbungs-Anweisung", "FR": "Lettre De Motivation", "ES": "Carta DE Presentación"},
}

func generateAndSaveCoverLetter(data CoverLetterInfo) (string, error) {
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.SetMargins(20, 30, 20)
	pdf.AddPage()

	fmt.Println(filepath.Dir(data.Font.Path))
	pdf.SetFontLocation(filepath.Dir(data.Font.Path))

	font, err := MatchFont(data.Font.Family, "Regular")
	if err != nil {
		fmt.Println(err)
		font = data.Font.Path
	}
	pdf.AddUTF8Font(data.Font.Family, "", filepath.Base(font))

	boldfont, err := MatchFont(data.Font.Family, "Bold")
	if err != nil {
		fmt.Println(err)
		boldfont = data.Font.Path
	}
	pdf.AddUTF8Font(data.Font.Family, "B", filepath.Base(boldfont))

	pdf.SetFont(data.Font.Family, "B", 18)

	pdf.CellFormat(0, 16, languageMap["CoverLetter"][data.Language], "", 0, "C", false, 0, "")

	html := pdf.HTMLBasicNew()

	pdf.SetFont(data.Font.Family, "", 11)
	if data.FirstName != "" || data.LastName != "" {
		pdf.Ln(20)
		html.Write(10, fmt.Sprintf("<b>%s:</b> %s %s", languageMap["Name"][data.Language], data.FirstName, data.LastName))
	}

	err = processAndRenderBirthday(data, &html, pdf)
	if err != nil {
		log.Printf("Error processing birthday: %v", err)
	}

	if data.Email != "" {
		pdf.Ln(5)
		html.Write(10, fmt.Sprintf("<b>%s:</b> %s", languageMap["Email"][data.Language], data.Email))
	}

	if len(data.PhoneNumbers) > 0 {
		pdf.Ln(5)
		var phonesStr string
		for _, phone := range data.PhoneNumbers {
			phonesStr +=
				fmt.Sprintf("<b>%s:</b> +%d %s      ",
					languageMap["Phone"][data.Language], phone.PhonePrefix.Prefix, phone.PhoneNumber)
		}
		html.Write(10, phonesStr)
	}

	if data.Street != "" || data.City != "" {
		pdf.Ln(5)
		html.Write(10,
			fmt.Sprintf("<b>%s:</b> %s, %s, %s, %s", languageMap["Address"][data.Language], data.Street, data.City, data.Zip, data.Country))
	}

	if data.Object != "" {
		pdf.Ln(20)
		pdf.SetFont(data.Font.Family, "B", 11)
		pdf.Cell(40, 10, fmt.Sprintf("%s: %s", languageMap["Subject"][data.Language], data.Object))
	}

	if data.Content != "" {
		pdf.Ln(10)
		pdf.SetFont(data.Font.Family, "", 11)
		pdf.MultiCell(0, 4, fmt.Sprintf(data.Content), "", "", false)
	}

	var buf bytes.Buffer
	err = pdf.Output(&buf)
	if err != nil {
		return "", fmt.Errorf("failed to generate pdf content: %w", err)
	}

	fileName, err := saveToTempDir(buf.Bytes(), data.Language)
	if err != nil {
		return "", fmt.Errorf("failed to save pdf file to temp dir: %w", err)
	}
	return fileName, nil
}

func processAndRenderBirthday(data CoverLetterInfo, html *gofpdf.HTMLBasicType, pdf *gofpdf.Fpdf) error {
	birthday, err := time.Parse("2006-01-02T15:04:05Z", data.Birthday.Date)
	if err != nil {
		return fmt.Errorf("failed to parse birthday: %w", err)
	}

	pdf.Ln(5)
	if data.Birthday.DateType == "DAY" {
		day := strconv.Itoa(birthday.Day())
		if len(day) == 1 {
			day = "0" + day
		}

		month := strconv.Itoa(int(birthday.Month()))
		if len(month) == 1 {
			month = "0" + month
		}

		html.Write(10, fmt.Sprintf("<b>%s</b>: %s/%s/%d", languageMap["Birthday"][data.Language], day, month, birthday.Year()))
	} else {
		pdf.Cell(0, 10, strconv.Itoa(birthday.Year()))
		html.Write(10, fmt.Sprintf("<b>%s</b>: %d", languageMap["Birthday"][data.Language], birthday.Year()))
	}
	return nil
}
