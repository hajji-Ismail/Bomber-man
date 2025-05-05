package models

type Player struct {
	Name  string `json:"name"`
	Rank  string `json:"rank"`
	Score int    `json:"score"`
	Time  string `json:"time"`
}
