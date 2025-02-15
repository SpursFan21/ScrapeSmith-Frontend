package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/auth0-community/go-auth0"
	"github.com/golang-jwt/jwt/v4"
	"github.com/gorilla/mux"
	"gopkg.in/square/go-jose.v2"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// User represents the structure for a user profile.
type User struct {
	ID    string `json:"id" bson:"_id,omitempty"`
	Email string `json:"email" bson:"email"`
	Name  string `json:"name" bson:"name"`
	// Add additional fields as needed.
}

var (
	client         *mongo.Client
	userCollection *mongo.Collection
)

func main() {
	// Initialize MongoDB connection.
	mongoURI := os.Getenv("MONGO_URI")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	var err error
	client, err = mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("MongoDB connection error:", err)
	}
	userCollection = client.Database("scrapesmith").Collection("users")

	// Initialize router.
	router := mux.NewRouter()

	// Create Auth0 JWT middleware.
	domain := os.Getenv("AUTH0_DOMAIN")     // e.g., "yourdomain.auth0.com"
	audience := os.Getenv("AUTH0_AUDIENCE") // e.g., your API identifier
	issuer := "https://" + domain + "/"
	jwksURI := issuer + ".well-known/jwks.json"

	secretProvider := auth0.NewJWKClient(auth0.JWKClientOptions{URI: jwksURI}, nil)
	configuration := auth0.NewConfiguration(secretProvider, []string{audience}, issuer, jose.RS256)
	validator := auth0.NewValidator(configuration, nil)

	// Secure API routes with JWT middleware.
	api := router.PathPrefix("/api").Subrouter()
	api.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Validate the JWT in the Authorization header.
			token, err := validator.ValidateRequest(r)
			if err != nil {
				http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)
				return
			}
			// Store the token in the request context.
			ctx := context.WithValue(r.Context(), "user", token)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	})

	// Define routes for user profile management.
	api.HandleFunc("/profile", getProfileHandler).Methods("GET")
	api.HandleFunc("/profile", updateProfileHandler).Methods("PUT")
	api.HandleFunc("/profile", createProfileHandler).Methods("POST")

	// Start the server.
	log.Println("Authentication & User Management Service running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}

// getProfileHandler retrieves the user profile from MongoDB based on the Auth0 user ID.
func getProfileHandler(w http.ResponseWriter, r *http.Request) {
	// Retrieve the JWT token from the context.
	token := r.Context().Value("user").(*jwt.Token)
	claims := token.Claims.(jwt.MapClaims)
	userID := claims["sub"].(string)

	// Query MongoDB for the user's profile.
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	var user User
	err := userCollection.FindOne(ctx, map[string]interface{}{"_id": userID}).Decode(&user)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(user)
}

// updateProfileHandler updates the user profile in MongoDB.
func updateProfileHandler(w http.ResponseWriter, r *http.Request) {
	token := r.Context().Value("user").(*jwt.Token)
	claims := token.Claims.(jwt.MapClaims)
	userID := claims["sub"].(string)

	var updatedUser User
	err := json.NewDecoder(r.Body).Decode(&updatedUser)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	// Ensure the user ID in the profile matches the Auth0 user ID.
	updatedUser.ID = userID

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	filter := map[string]interface{}{"_id": userID}
	update := map[string]interface{}{"$set": updatedUser}
	_, err = userCollection.UpdateOne(ctx, filter, update)
	if err != nil {
		http.Error(w, "Failed to update user", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(updatedUser)
}

// createProfileHandler creates a new user profile in MongoDB.
func createProfileHandler(w http.ResponseWriter, r *http.Request) {
	token := r.Context().Value("user").(*jwt.Token)
	claims := token.Claims.(jwt.MapClaims)
	userID := claims["sub"].(string)

	var newUser User
	err := json.NewDecoder(r.Body).Decode(&newUser)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	// Use the Auth0 user ID as the primary key.
	newUser.ID = userID

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err = userCollection.InsertOne(ctx, newUser)
	if err != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newUser)
}
