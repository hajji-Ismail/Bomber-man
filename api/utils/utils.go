package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"sort"

	"portfolio-api/models"
)

func LoadJSON[T any](filePath string, target *[]T) error {
	// lets read the json file data into a slice of bytes
	content, err := os.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("failed to read data from : %s", filePath)
	}

	// lets unmarshel the content into our target
	if err := json.Unmarshal(content, &target); err != nil {
		return fmt.Errorf("failed to Unmarshal data from : %s,%w", filePath, err)
	}
	return nil
}

func SaveJSON(filePath string, newData models.Player) error {
	var existingData []models.Player

	// Step 1: Check if file exists and read old data
	bytes, err := os.ReadFile(filePath)
	if err == nil {
		// If file exists, try to unmarshal into existingData
		if len(bytes) > 0 {
			if err := json.Unmarshal(bytes, &existingData); err != nil {
				return fmt.Errorf("failed to unmarshal existing JSON: %w", err)
			}
		}
	} else if !os.IsNotExist(err) {
		// If error is not "file doesn't exist", return it
		return fmt.Errorf("failed to read file %s: %w", filePath, err)
	}

	// Step 2: Append newData to existingData
	existingData = append(existingData, newData)

	// Step 3: Sort players by Score in descending order (highest score first)
	sort.Slice(existingData, func(i, j int) bool {
		return existingData[i].Score > existingData[j].Score
	})

	// Step 4: Marshal and Save back to file
	newBytes, err := json.MarshalIndent(existingData, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal JSON: %w", err)
	}

	err = os.WriteFile(filePath, newBytes, 0o644)
	if err != nil {
		return fmt.Errorf("failed to write file %s: %w", filePath, err)
	}

	return nil
}

func EnableCORS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") // Allow all origins — for dev
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Handle preflight request
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
}

func RespondWithError(w http.ResponseWriter, err models.Error) {
	response := map[string]any{
		"code":    err.Code,
		"message": err.Message,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(err.Code)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		RespondWithError(w, models.Error{Message: "Inetrnal Server Error", Code: http.StatusInternalServerError})
	}
}

// Helper function to standardize JSON responses
func RespondWithJSON(w http.ResponseWriter, statusCode int, response any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		RespondWithError(w, models.Error{Message: "Inetrnal Server Error", Code: http.StatusInternalServerError})
	}
}
