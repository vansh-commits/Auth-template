// main.go
package main

import (
	"backend/database"
	"backend/models"
	"errors"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"gorm.io/gorm"
)

func main() {
	database.Connect()

	app := fiber.New()
	app.Use(logger.New())

	// Middleware to check internal token
	app.Use("/internal", func(c *fiber.Ctx) error {
		token := c.Get("x-internal-token")
		if token != os.Getenv("INTERNAL_SYNC_TOKEN") {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "unauthorized",
			})
		}
		return c.Next()
	})

	// Internal SSO Sync Route
	app.Post("/internal/sso-sync", func(c *fiber.Ctx) error {
		var body struct {
			Provider          string `json:"provider"`
			ProviderAccountId string `json:"providerAccountId"`
			Email             string `json:"email"`
			Name              string `json:"name"`
			AvatarUrl         string `json:"avatarUrl"`
			EmailVerified     bool   `json:"emailVerified"`
		}

		if err := c.BodyParser(&body); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid request"})
		}

		var user models.User
		result := database.DB.Where("provider = ? AND provider_account_id = ?", body.Provider, body.ProviderAccountId).First(&user)

		if result.Error == nil {
			// ✅ Update existing user
			user.Email = body.Email
			user.Name = body.Name
			user.AvatarUrl = body.AvatarUrl
			user.EmailVerified = body.EmailVerified
			if err := database.DB.Save(&user).Error; err != nil {
				return c.Status(500).JSON(fiber.Map{"error": "failed to update user"})
			}
		} else if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			// ✅ Create new user
			user = models.User{
				Provider:          body.Provider,
				ProviderAccountID: body.ProviderAccountId,
				Email:             body.Email,
				Name:              body.Name,
				AvatarUrl:         body.AvatarUrl,
				EmailVerified:     body.EmailVerified,
			}
			if err := database.DB.Create(&user).Error; err != nil {
				log.Printf("❌ Failed to create user: %v", err)
				return c.Status(500).JSON(fiber.Map{"error": "failed to create user"})
			}
		} else {
			return c.Status(500).JSON(fiber.Map{"error": "database error"})
		}

		// ✅ Always return user ID
		return c.JSON(fiber.Map{
			"status": "ok",
			"userId": user.ID,
		})
	})

	log.Fatal(app.Listen(":8080"))
}
