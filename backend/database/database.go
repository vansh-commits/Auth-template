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
    // Load .env in local only
    _ = godotenv.Load()

    dsn := os.Getenv("DATABASE_URL")
    if dsn == "" {
        log.Fatal("❌ DATABASE_URL not set. Please configure environment variables.")
    }

    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatalf("❌ Failed to connect to database: %v", err)
    }

    // Check DB connection
    sqlDB, err := db.DB()
    if err != nil {
        log.Fatalf("❌ Failed to get DB instance: %v", err)
    }

    if err := sqlDB.Ping(); err != nil {
        log.Fatalf("❌ Database is unreachable: %v", err)
    }

    // Auto migrate models
    if err := db.AutoMigrate(&models.User{}); err != nil {
        log.Fatalf("❌ Failed to migrate database: %v", err)
    }

    DB = db
    fmt.Println("✅ Database connected & migrated successfully")
}
