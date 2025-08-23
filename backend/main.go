// main.go
package main

import (
	"backend/database"
	"backend/routes"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
	
)

func main() {
	database.Connect()


	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found or couldn't load it")
	}

	app := fiber.New()
	app.Use(logger.New())
	

	// CORS middleware - must come before other middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000,http://127.0.0.1:3000", // Frontend URLs
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization,Cookie",
		AllowCredentials: true, // Important for cookies
		ExposeHeaders:    "Set-Cookie",
		MaxAge:           300, // Cache preflight for 5 minutes
	}))

	routes.SetupRoutes(app)
	log.Fatal(app.Listen(":8080"))
}
