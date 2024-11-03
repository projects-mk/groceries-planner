package v1

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func ListItemsHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userId := c.GetString("AuthenticatedUserID")

		items := ListItems(userId, db)

		c.JSON(http.StatusOK, gin.H{"result": items})
	}
}

func AddItemHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userId := c.GetString("AuthenticatedUserID")
		product := c.Query("product")
		msg := AddItem(product, userId, db)
		c.JSON(http.StatusOK, gin.H{"result": msg})
	}
}

func DeleteItemHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userId := c.GetString("AuthenticatedUserID")
		productId, _ := strconv.Atoi(c.Query("productId"))
		msg := DeleteItem(productId, userId, db)
		c.JSON(http.StatusOK, gin.H{"result": msg})
	}
}

func UpdateBasketHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userId := c.GetString("AuthenticatedUserID")
		productId, _ := strconv.Atoi(c.Query("productId"))
		method := c.Query("method")

		msg := UpdateBasket(productId, userId, method, db)
		c.JSON(http.StatusOK, gin.H{"result": msg})
	}
}
