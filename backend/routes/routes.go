package routes

import "github.com/gofiber/fiber/v2"

func SetupRoutes(app *fiber.App) {
	// Group routes
	SetupAuthRoutes(app)
	SetgetUsers(app)
}
