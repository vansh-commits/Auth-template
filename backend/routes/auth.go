package routes

import (
	"backend/database"
	"backend/models"
	"errors"


	"backend/middlewares"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func SetupAuthRoutes(app *fiber.App) {
	

	auth := app.Group("/auth")

	auth.Use(middlewares.VerifyInternal)

	auth.Post("/internal/sso-sync", func(c *fiber.Ctx) error {

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
				
				return c.Status(500).JSON(fiber.Map{"error": "failed to create user"})
			}
		} else {
			
			return c.Status(500).JSON(fiber.Map{"error": "database error"})
		}

		return c.JSON(fiber.Map{
			"status": "ok",
			"userId": user.ID,
		})
	})


	
}
