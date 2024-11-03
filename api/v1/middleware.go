package v1

import (
	"log"
	auth "projects-mk/groceries-planner/auth"
	"strconv"

	"github.com/gin-gonic/gin"
)

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Check if the "Token" header is provided with the request
		tokenHeader := c.GetHeader("Token")
		if tokenHeader == "" {
			log.Printf("JWT token not provided\n")
			c.JSON(401, gin.H{"error": "JWT token not provided"})
			c.Abort()
			return
		}

		// Validate and parse token
		claims, err := auth.ParseJWT(tokenHeader)
		if err != nil {
			log.Printf("Invalid or expired JWT token: %v\n", err)
			c.JSON(401, gin.H{"error": "Invalid or expired JWT token"})
			c.Abort()
			return
		}

		// If needed, you can access your claims and use them here
		// For example, you can set headers with values from the claims:
		// Assuming claims has fields like 'UserId' and 'UserEmail'
		c.Set("AuthenticatedUserID", strconv.Itoa(claims.UserId)) // Add custom header with User ID
		c.Set("AuthenticatedUserEmail", claims.UserEmail)         // Add custom header with User Email

		// Add content-type header for completeness (optional)
		c.Set("Content-Type", "application/json")

		// Call the next middleware/handler in the chain AFTER this middleware is done
		c.Next()
	}
}
