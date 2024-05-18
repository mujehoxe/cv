package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	translator "github.com/Conight/go-googletrans"
)

// Translate translates text from one language to another
func (a *App) Translate(text string, sourceLanguage string, targetLanguage string) (string, error) {
	t := translator.New()

	result, err := t.Translate(text, sourceLanguage, targetLanguage)
	if err != nil {
		return "", fmt.Errorf("failed to translate: %w", err)
	}

	return result.Text, nil
}

// TranslateHTML takes an html string and returns the translated version of it
func (a *App) TranslateHTML(html string, sourceLanguage string, targetLanguage string) (string, error) {
	data := url.Values{
		"q":      []string{html},
		"source": []string{strings.ToLower(sourceLanguage)},
		"target": []string{strings.ToLower(targetLanguage)},
		"format": []string{"html"},
	}

	req, err := http.NewRequest("POST", "http://localhost:5000/translate", strings.NewReader(data.Encode()))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded") // Ensure the content type is set correctly for form data

	resp, err := a.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("server responded with status code: %d, message: %s", resp.StatusCode, string(body))
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("error reading response body: %w", err)
	}

	var result map[string]string
	if err := json.Unmarshal(body, &result); err != nil {
		return "", fmt.Errorf("error unmarshalling response body: %w", err)
	}

	return result["translatedText"], nil
}
