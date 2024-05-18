package main

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"github.com/google/uuid"
	wailsRuntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx    context.Context
	client *http.Client
	db     *sql.DB
}

// NewApp creates a new App application struct
func NewApp() *App {
	createUsersTable()
	createProfilesTable()

	return &App{
		client: &http.Client{},
		db:     GetDBInstance(),
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) confirmClose(ctx context.Context) (prevent bool) {
	options := wailsRuntime.MessageDialogOptions{
		Type:          wailsRuntime.QuestionDialog,
		Title:         "Confirmation",
		Buttons:       []string{"Yes", "No"},
		Message:       "Are you sure you want to quit?",
		DefaultButton: "No",
		CancelButton:  "No",
	}

	//wailsRuntime.MessageDialog
	result, err := wailsRuntime.MessageDialog(ctx, options)
	if err != nil {
		return true
	}
	if result == "Yes" {
		return false
	}
	return true
}

// setHeaders sets the necessary headers for the request.
func (a *App) setHeaders(req *http.Request, ro RequestOptions) {
	req.Header.Set("Content-Type", ro.ContentType)
	if ro.Accept != "" {
		req.Header.Set("Accept", ro.Accept)
	}

	req.Header.Set("Cache-Control", "No-Cache")
	req.Header.Set("Cookie", "dtCookie=v_4_srv_29_sn_6D7055F5231D1CF83D1A9F05636D17D4_perc_100000_ol_0_mul_1_app-3A5808f124b494edbd_1_rcs-3Acss_0; XSRF-TOKEN=77f8ec07-7d2a-4f83-a85f-ede1ad34ac1c; EUROPASS_AUTH_SESSION_ID=YWI1NjUwMmEtZjAzMy00NmYyLWI1OWEtODcwNmNhMTNjODA5; dtCookie=v_4_srv_29_sn_C42298474F7F5D57468E9E961B0FC212; _pk_id.1bd3d421-8073-4872-99de-c7c0e2242372.9e93=2c6e799c335a029a.1709755680.4.1710114456.1710111255.; cck1=%7B%22cm%22%3Atrue%2C%22all1st%22%3Atrue%2C%22closed%22%3Atrue%7D; rxVisitor=1709755986319M0MB0IFEJKJL9PRIO3D13SV5UJJ818R7; dtCookie=v_4_srv_29_sn_6D7055F5231D1CF83D1A9F05636D17D4_perc_100000_ol_0_mul_1_app-3A5808f124b494edbd_1_rcs-3Acss_0; dtSa=-; rxvt=1710116280089|1710113089694; dtPC=29$114452058_568h19vGHTFJQIIKTRDNMTAPTWRMAOLHCAPAADR-0e0")
	req.Header.Set("X-XSRF-TOKEN", "77f8ec07-7d2a-4f83-a85f-ede1ad34ac1c")
}

// makeRequest makes an HTTP request, checks the status code, and returns the response.
// It also ensures the response body is closed.
func (a *App) makeRequest(ro RequestOptions) (*http.Response, error) {
	req, err := http.NewRequest(ro.Method, ro.URL, ro.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	a.setHeaders(req, ro)

	resp, err := a.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}

	if resp.StatusCode != ro.ExpectedStatusCode {
		return nil, fmt.Errorf("request failed with status code: %d", resp.StatusCode)
	}

	return resp, nil
}

// unmarshalJSONResponse unmarshals the JSON response body into the provided result struct.
func (a *App) unmarshalJSONResponse(resp *http.Response) (*struct {
	ID string `json:"id"`
}, error) {
	var result *struct {
		ID string `json:"id"`
	}
	err := json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		return nil, fmt.Errorf("error unmarshaling response: %w", err)
	}

	return result, nil
}

// CreateCVProfile creates a CV profile and returns the profile ID.
func (a *App) CreateCVProfile(jsonData string) (string, error) {
	reqOps := NewRequestOptionsBuilder("POST", "https://europa.eu/europass/eportfolio/api/eprofile/cv").
		Body(bytes.NewBuffer([]byte(jsonData))).
		ExpectedStatusCode(http.StatusCreated).
		ContentType("application/json").
		Build()

	resp, err := a.makeRequest(reqOps)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	result, err := a.unmarshalJSONResponse(resp)
	if err != nil {
		return "", err
	}

	return result.ID, nil
}

// UpdateCVProfile updates a CV profile and returns the profile ID.
func (a *App) UpdateCVProfile(profileID string, jsonData string) (string, error) {
	reqOps := NewRequestOptionsBuilder("PUT", fmt.Sprintf("https://europa.eu/europass/eportfolio/api/eprofile/cv/%s", profileID)).
		Body(bytes.NewBuffer([]byte(jsonData))).
		ExpectedStatusCode(http.StatusOK).
		ContentType("application/json").
		Build()

	resp, err := a.makeRequest(reqOps)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	result, err := a.unmarshalJSONResponse(resp)
	if err != nil {
		return "", err
	}

	return result.ID, nil
}

// getPdfId retrieves the PDF ID for a given profile ID.
func (a *App) getPdfId(profileID string) (string, error) {
	data := map[string]interface{}{
		"headers": map[string]string{
			"accept": "application/json",
		},
		"params": map[string]interface{}{
			"updates":   nil,
			"cloneFrom": nil,
			"encoder":   map[string]interface{}{},
			"map":       nil,
		},
		"responseType": "json",
	}

	jsonData, err := json.Marshal(data)
	if err != nil {
		return "", fmt.Errorf("error marshaling data: %w", err)
	}

	reqOps := NewRequestOptionsBuilder("POST",
		fmt.Sprintf("https://europa.eu/europass/eportfolio/api/eprofile/cv/%s", profileID)).
		Body(bytes.NewBuffer([]byte(jsonData))).
		ExpectedStatusCode(http.StatusOK).
		ContentType("application/json").
		Build()

	resp, err := a.makeRequest(reqOps)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	result, err := a.unmarshalJSONResponse(resp)
	if err != nil {
		return "", err
	}

	return result.ID, nil
}

// fetchPdfFile retrieves the PDF file given its ID.
func (a *App) fetchPdfFile(pdfID string) ([]byte, error) {
	maxRetries := 10
	initialDelay := 100 * time.Millisecond
	maxDelay := 2 * time.Second

	var body []byte
	var err error
	for i := 0; i < maxRetries; i++ {
		reqOps := NewRequestOptionsBuilder(
			"GET",
			fmt.Sprintf("https://europa.eu/europass/eportfolio/api/office/download/pdf/%s", pdfID)).
			ExpectedStatusCode(http.StatusOK).
			ContentType("application/json").
			Accept("application/pdf").
			Build()

		var resp *http.Response
		resp, err = a.makeRequest(reqOps)

		if err != nil {
			if strings.Contains(err.Error(), fmt.Sprint(http.StatusNoContent)) {
				delay := initialDelay * time.Duration(math.Pow(2, float64(i)))
				if delay > maxDelay {
					delay = maxDelay
				}
				time.Sleep(delay)
			}
			continue
		}
		defer resp.Body.Close()

		body, err = io.ReadAll(resp.Body)
		if err != nil {
			return nil, fmt.Errorf("error reading response body: %w", err)
		}

		break
	}

	if err != nil {
		return nil, fmt.Errorf("failed to get pdf file with id %s after %d retries", pdfID, maxRetries)
	}

	return body, nil
}

// FetchCVAndSave fetches the CV for the given profile and saves it to temp file.
func (a *App) FetchCVAndSave(profileID string, language string) (string, error) {
	pdfID, err := a.getPdfId(profileID)
	if err != nil {
		return "", fmt.Errorf("failed to get pdf id: %w", err)
	}

	pdfContent, err := a.fetchPdfFile(pdfID)
	if err != nil {
		return "", fmt.Errorf("failed to get pdf file whith id %s: %w", pdfID, err)
	}

	fileName, err := saveToTempDir(pdfContent, language)
	if err != nil {
		return "", fmt.Errorf("failed to save pdf file to temp dir: %w", err)
	}

	return fileName, nil
}

// saveToTempDir saves the content of the PDF in a temporary directory,
// returns the path to the created file
func saveToTempDir(content []byte, fileName string) (string, error) {
	file, err := os.CreateTemp("", fmt.Sprintf("%s.pdf", fileName))
	if err != nil {
		return "", fmt.Errorf("failed to create temporary file: %w", err)
	}
	defer file.Close()

	_, err = file.Write(content)
	if err != nil {
		os.Remove(file.Name())
		return "", fmt.Errorf("failed to write content to file: %w", err)
	}

	err = file.Sync()
	if err != nil {
		os.Remove(file.Name())
		return "", fmt.Errorf("failed to sync file: %w", err)
	}

	return file.Name(), nil
}

func saveBase64ImageToLocalStorage(image, location string) (string, error) {
	parts := strings.SplitN(image, ";", 2)
	if len(parts) < 2 {
		return "", errors.New("invalid image format")
	}

	mimeType := strings.Split(parts[0], ":")[1]
	dataString := parts[1]
	dataString = strings.TrimPrefix(dataString, "base64,")
	data, err := base64.StdEncoding.DecodeString(dataString)
	if err != nil {
		return "", fmt.Errorf("failed to decode image data: %w", err)
	}

	var extension string
	switch mimeType {
	case "image/jpeg":
		extension = ".jpg"
	case "image/png":
		extension = ".png"
	case "image/webp":
		extension = ".webp"
	default:
		return "", fmt.Errorf("unsupported image type: %s", mimeType)
	}

	if _, err := os.Stat(location); os.IsNotExist(err) {
		err := os.MkdirAll(location, 0755)
		if err != nil {
			return "", fmt.Errorf("failed to create directory: %w", err)
		}
	}

	fileName := uuid.New().String() + extension
	path := filepath.Join(location, fileName)
	err = os.WriteFile(path, data, 0644)
	if err != nil {
		return "", fmt.Errorf("failed to write image to file: %w", err)
	}

	return path, nil
}

// GetPdfFile returns the content of the PDF file at the given path
func (a *App) GetPdfFile(filePath string) ([]byte, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	data, err := io.ReadAll(file)
	if err != nil {
		return nil, fmt.Errorf("failed to read file: %w", err)
	}
	return data, nil
}

// Open pdf file in system's default viewer, os agnostic
func (a *App) OpenPDF(path string) error {
	var cmd *exec.Cmd

	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("cmd", "/c", "start", path)
	case "darwin":
		cmd = exec.Command("open", path)
	default:
		cmd = exec.Command("xdg-open", path)
	}
	err := cmd.Run()
	if err != nil {
		return fmt.Errorf("failed to open pdf file: %w", err)
	}

	return nil
}

// Get the list of digital skills from europass
func (a *App) FetchDigitalSkillsAutocomplete(search string) ([]string, error) {
	reqOps := NewRequestOptionsBuilder("GET", fmt.Sprintf("https://europa.eu/europass/eportfolio/api/eprofile/digital-skills/autocomplete?search=%s&language=en&size=10", url.QueryEscape(search))).
		ExpectedStatusCode(http.StatusOK).
		ContentType("application/json").
		Build()

	resp, err := a.makeRequest(reqOps)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result []string
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		return nil, fmt.Errorf("error unmarshaling response: %w", err)
	}

	return result, nil
}
