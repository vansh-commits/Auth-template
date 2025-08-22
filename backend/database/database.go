// database/database.go
package database

import (
    "fmt"
    "log"
    "os"

    "gorm.io/driver/postgres"
    "gorm.io/gorm"
    "backend/models"
	"github.com/joho/godotenv"
)

var DB *gorm.DB

func Connect() {
	if err := godotenv.Load(); err != nil {
        log.Println("⚠️  No .env file found, using system environment variables")
    }
	
    dsn := os.Getenv("DATABASE_URL")
    if dsn == "" {
        log.Fatal("DATABASE_URL is not set in .env")
    }

    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }

    // Auto migrate your models
    if err := db.AutoMigrate(&models.User{}); err != nil {
        log.Fatal("Failed to migrate database:", err)
    }

    DB = db
    fmt.Println("✅ Database connected & migrated")
}
