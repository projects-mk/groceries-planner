package auth

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateUserHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {

		var newUser UserCreds

		if err := c.ShouldBindJSON(&newUser); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Error parsing request " + err.Error()})
			return
		}

		err := newUser.Register(db)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Error during registration " + err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"result": "OK"})
	}
}

func LoginUserHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var user UserCreds

		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Error parsing request " + err.Error()})
			return
		}

		JWTToken := user.Login(db)

		if JWTToken == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Wrong Username or Password\n"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"result": JWTToken})
	}
}

func DeleteUserHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {

		userId, _ := strconv.Atoi(c.GetString("AuthenticatedUserID"))
		userEmail := c.GetString("AuthenticatedUserEmail")

		user := User{
			Id:    userId,
			Email: userEmail,
		}
		err := user.Delete(db)

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Can't delete user:" + err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"result": "OK"})
	}
}
