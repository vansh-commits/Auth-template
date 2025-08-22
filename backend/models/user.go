// models/user.go
package models

import "time"

type User struct {
    ID               uint      `gorm:"primaryKey:autoIncrement"`
    Provider         string    `gorm:"not null"`
    ProviderAccountID string    `gorm:"not null;uniqueIndex"`
    Email            string    `gorm:"uniqueIndex;not null"`
    Name             string
    AvatarUrl        string
    EmailVerified    bool
    CreatedAt        time.Time
    UpdatedAt        time.Time
}
