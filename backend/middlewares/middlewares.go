package middlewares

import (

	"os"


	"github.com/gofiber/fiber/v2"
)



func VerifyInternal(c *fiber.Ctx) error {
	token := c.Get("x-internal-token")
		if token != os.Getenv("INTERNAL_SYNC_TOKEN") {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "unauthorized",
			})
		}
		return c.Next()
}
