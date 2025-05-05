package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"portfolio-api/models"
	"portfolio-api/utils"
)



func SaveScores(w http.ResponseWriter, r *http.Request) {
	
	if r.Method != http.MethodPost{
		utils.RespondWithError(w, models.Error{Message: "Method Not Allawed", Code: http.StatusMethodNotAllowed})
		return
	}
	var player models.Player
	
	if err := json.NewDecoder(r.Body).Decode(&player); err != nil {
		fmt.Println(err)
		utils.RespondWithError(w, models.Error{Message: "Inetrnal Server Error", Code: http.StatusInternalServerError})
		return
	}
	if player.Name == "" || player.Score < 0 {
		utils.RespondWithError(w, models.Error{Message: "Bad Request", Code: http.StatusBadRequest})
		return
	}
	player.Time = time.Now().Format(time.DateTime)

	err := utils.SaveJSON("./storage/scores.json", player)
	if err != nil {
		utils.RespondWithError(w, models.Error{Message: "Internal Server Error", Code: http.StatusInternalServerError})
		return
	}
	var players []models.Player
	errr := utils.LoadJSON("./storage/scores.json", &players)
	if errr != nil {
		utils.RespondWithError(w, models.Error{Message: "Internal Server Error", Code: http.StatusInternalServerError})
		return
	}
	if err := json.NewEncoder(w).Encode(players); err != nil {
		utils.RespondWithError(w, models.Error{Message: "Inetrnal Server Error", Code: http.StatusInternalServerError})
	}
}
