package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

// App struct
type App struct {
	ctx    context.Context
	client *http.Client
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		client: &http.Client{},
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// setHeaders sets the necessary headers for the request.
func (a *App) setHeaders(req *http.Request, contentType string) {
	req.Header.Set("Content-Type", contentType)
	req.Header.Set("Cookie", "dtCookie=v_4_srv_29_sn_6D7055F5231D1CF83D1A9F05636D17D4_perc_100000_ol_0_mul_1_app-3A5808f124b494edbd_1_rcs-3Acss_0; XSRF-TOKEN=77f8ec07-7d2a-4f83-a85f-ede1ad34ac1c; EUROPASS_AUTH_SESSION_ID=YWI1NjUwMmEtZjAzMy00NmYyLWI1OWEtODcwNmNhMTNjODA5; dtCookie=v_4_srv_29_sn_C42298474F7F5D57468E9E961B0FC212; _pk_id.1bd3d421-8073-4872-99de-c7c0e2242372.9e93=2c6e799c335a029a.1709755680.4.1710114456.1710111255.; cck1=%7B%22cm%22%3Atrue%2C%22all1st%22%3Atrue%2C%22closed%22%3Atrue%7D; rxVisitor=1709755986319M0MB0IFEJKJL9PRIO3D13SV5UJJ818R7; dtCookie=v_4_srv_29_sn_6D7055F5231D1CF83D1A9F05636D17D4_perc_100000_ol_0_mul_1_app-3A5808f124b494edbd_1_rcs-3Acss_0; dtSa=-; rxvt=1710116280089|1710113089694; dtPC=29$114452058_568h19vGHTFJQIIKTRDNMTAPTWRMAOLHCAPAADR-0e0")
	req.Header.Set("X-XSRF-TOKEN", "77f8ec07-7d2a-4f83-a85f-ede1ad34ac1c")
}

// makeRequest makes an HTTP request, checks the status code, and returns the response.
// It also ensures the response body is closed.
func (a *App) makeRequest(method, url string, body io.Reader, expectedStatusCode int, contentType string) (*http.Response, error) {
	req, err := http.NewRequest(method, url, body)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	a.setHeaders(req, contentType)

	resp, err := a.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}

	if resp.StatusCode != expectedStatusCode {
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

// createCVProfile creates a CV profile and returns the profile ID.
func (a *App) createCVProfile(jsonData string) (string, error) {
	resp, err := a.makeRequest(
		"POST",
		"https://europa.eu/europass/eportfolio/api/eprofile/cv",
		bytes.NewBuffer([]byte(jsonData)),
		http.StatusCreated,
		"application/json")
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

	resp, err := a.makeRequest(
		"POST",
		fmt.Sprintf("https://europa.eu/europass/eportfolio/api/eprofile/cv/%s", profileID),
		bytes.NewBuffer(jsonData),
		http.StatusOK,
		"application/json")
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

// getPdfFile retrieves the PDF file given its ID.
func (a *App) getPdfFile(pdfID string) ([]byte, error) {
	resp, err := a.makeRequest(
		"GET",
		fmt.Sprintf("https://europa.eu/europass/eportfolio/api/office/download/pdf/%s", pdfID),
		nil,
		http.StatusOK,
		"application/pdf")

	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response body: %w", err)
	}

	return body, nil
}

func (a *App) FetchCV(data string) ([]byte, error) {
	profileID, err := a.createCVProfile(data)
	if err != nil {
		return nil, fmt.Errorf("failed to create CV profile: %w", err)
	}

	pdfID, err := a.getPdfId(profileID)
	if err != nil {
		return nil, fmt.Errorf("failed to get pdf id: %w", err)
	}

	pdfContent, err := a.getPdfFile(pdfID)
	if err != nil {
		return nil, fmt.Errorf("failed to get pdf file: %w", err)
	}

	err = os.WriteFile("cv.pdf", pdfContent, 0644)
	if err != nil {
		return nil, fmt.Errorf("failed to export pdf file: %w", err)
	}

	return pdfContent, nil
}
