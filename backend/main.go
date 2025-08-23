// main.go
package main

import (
	"backend/routes"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found or couldn't load it")
	}

	app := fiber.New()

	// CORS middleware - must come before other middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000,http://127.0.0.1:3000,https://auth-template-lac.vercel.app/", // Frontend URLs
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization,Cookie",
		AllowCredentials: true, // Important for cookies
		ExposeHeaders:    "Set-Cookie",
	}))

	app.Use(logger.New())
	routes.SetupRoutes(app)
	log.Fatal(app.Listen(":8080"))
}
