package v1

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Checks status of api server
func Healthcheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "OK"})
}
