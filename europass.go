package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math"
	"mime/multipart"
	"net/http"
	"net/textproto"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

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

// GetProfile gets a profile by its ID from europass
func (a *App) GetProfile(profileId string) (any, error) {
	url := "https://europa.eu/europass/eportfolio/api/eprofile/cv/" + profileId
	reqOps := NewRequestOptionsBuilder("GET", url).
		ExpectedStatusCode(http.StatusOK).
		ContentType("application/json").
		Accept("application/json").
		Build()

	resp, err := a.makeRequest(reqOps)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var result any
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		return "", err
	}

	return result, nil
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

// Get profile from PDF file CV
// send multipart to https://europa.eu/europass/eportfolio/api/eprofile/europass-cv
// multipart/form-data; boundary=----WebKitFormBoundaryk1hwNgwsAnJlV7Y2
func (a *App) ImportCV() (any, error) {
	filePath, err := a.choosePDF()
	if err != nil {
		return nil, fmt.Errorf("error choosing file: %w", err)
	}

	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("error opening file: %w", err)
	}
	defer file.Close()

	b := &bytes.Buffer{}
	writer := multipart.NewWriter(b)

	h := make(textproto.MIMEHeader)
	h.Set("Content-Disposition", fmt.Sprintf(
		`form-data; name="file"; filename="%s.pdf"`, filepath.Base(filePath)))
	h.Set("Content-Type", "application/pdf")
	part, err := writer.CreatePart(h)
	if err != nil {
		log.Fatal(err)
	}

	_, err = io.Copy(part, file)
	if err != nil {
		return nil, fmt.Errorf("error copying file into request: %w", err)
	}
	err = writer.Close()
	if err != nil {
		return nil, fmt.Errorf("error closing writer: %w", err)
	}

	req, err := http.NewRequest(
		"POST",
		"https://europa.eu/europass/eportfolio/api/eprofile/europass-cv",
		b)

	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}
	req.Header.Add("Content-Type", writer.FormDataContentType())
	req.Header.Add("Cookie", "dtCookie=v_4_srv_29_sn_6D7055F5231D1CF83D1A9F05636D17D4_perc_100000_ol_0_mul_1_app-3A5808f124b494edbd_1_rcs-3Acss_0; XSRF-TOKEN=77f8ec07-7d2a-4f83-a85f-ede1ad34ac1c; EUROPASS_AUTH_SESSION_ID=YWI1NjUwMmEtZjAzMy00NmYyLWI1OWEtODcwNmNhMTNjODA5; dtCookie=v_4_srv_29_sn_C42298474F7F5D57468E9E961B0FC212; _pk_id.1bd3d421-8073-4872-99de-c7c0e2242372.9e93=2c6e799c335a029a.1709755680.4.1710114456.1710111255.; cck1=%7B%22cm%22%3Atrue%2C%22all1st%22%3Atrue%2C%22closed%22%3Atrue%7D; rxVisitor=1709755986319M0MB0IFEJKJL9PRIO3D13SV5UJJ818R7; dtCookie=v_4_srv_29_sn_6D7055F5231D1CF83D1A9F05636D17D4_perc_100000_ol_0_mul_1_app-3A5808f124b494edbd_1_rcs-3Acss_0; dtSa=-; rxvt=1710116280089|1710113089694; dtPC=29$114452058_568h19vGHTFJQIIKTRDNMTAPTWRMAOLHCAPAADR-0e0")
	req.Header.Add("X-XSRF-TOKEN", "77f8ec07-7d2a-4f83-a85f-ede1ad34ac1c")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response body: %w", err)
	}
	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("bad status code: %d\n%s", resp.StatusCode, string(body))
	}

	var result any
	err = json.Unmarshal(body, &result)
	if err != nil {
		return nil, fmt.Errorf("error unmarshalling response: %w", err)
	}

	return result, nil
}

func (a *App) choosePDF() (string, error) {
	filePath, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select PDF File",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Documents (*.pdf)",
				Pattern:     "*.pdf;",
			},
		},
		ShowHiddenFiles: true,
	})
	if err != nil {
		return "", fmt.Errorf("error opening dialog: %w", err)
	}
	if filePath == "" {
		return "", fmt.Errorf("no files selected")
	}
	return filePath, nil
}
