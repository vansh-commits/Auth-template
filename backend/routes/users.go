package routes

import (
	"backend/database"
	"backend/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// UserSummary represents the minimal user data for bulk listing
type UserSummary struct {
	ID        uint   `json:"id"`
	Name      string `json:"name"`
	AvatarUrl string `json:"avatarUrl"`
}

func SetgetUsers(app *fiber.App) {
	users := app.Group("/users")

	//find all the users
	users.Get("/bulk", func(c *fiber.Ctx) error {
		var users []models.User

		// Fetch all users
		if err := database.DB.Find(&users).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to fetch users",
			})
		}

		// Convert to UserSummary format
		var summaries []UserSummary
		for _, user := range users {
			summaries = append(summaries, UserSummary{
				ID:        user.ID,
				Name:      user.Name,
				AvatarUrl: user.AvatarUrl,
			})
		}

		return c.JSON(summaries)
	})

	users.Get("/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")

		// Convert string ID to uint
		userID, err := strconv.Atoi(id)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid user ID",
			})
		}

		var user models.User
		result := database.DB.First(&user, userID)

		if result.Error != nil {
			if result.Error.Error() == "record not found" {
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
					"error": "User not found",
				})
			}
			// Other DB error
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Database error: " + result.Error.Error(),
			})
		}

		return c.JSON(user)
	})

}
