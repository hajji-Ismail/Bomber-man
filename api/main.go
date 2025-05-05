package main

import (
	"fmt"
	"net/http"

	"portfolio-api/handlers"
)

func main() {
	mux := http.NewServeMux()
	mux.Handle("/api/scores", CorsMiddleware(http.HandlerFunc(handlers.SaveScores)))

	fmt.Println("server is running on port 8080 >>> http://localhost:5051")
	http.ListenAndServe(":5051", CorsMiddleware(mux))
}

func CorsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") // or specify 127.0.0.1:5501
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			// Important: return immediately for preflight!
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}
