package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	auth "projects-mk/groceries-planner/auth"
	db "projects-mk/groceries-planner/db"
	v1 "projects-mk/groceries-planner/v1"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	router := gin.Default()

	db := db.GetDBClient()

	apiV1 := router.Group("/api/v1")
	apiV1.Use(v1.Auth())

	apiV1.GET("/healthcheck", v1.Healthcheck)
	apiV1.GET("/items/list", v1.ListItemsHandler((db)))
	apiV1.DELETE("/items/delete", v1.DeleteItemHandler(db))
	apiV1.PUT("/items/add", v1.AddItemHandler(db))
	apiV1.PATCH("/items/update", v1.UpdateBasketHandler(db))

	apiAuth := router.Group("/api/auth")

	apiAuth.POST("/register", auth.CreateUserHandler(db))
	apiAuth.POST("/login", auth.LoginUserHandler(db))

	apiUserManagement := router.Group("/api/user")
	apiUserManagement.Use(v1.Auth())
	apiUserManagement.DELETE("/delete", auth.DeleteUserHandler(db))

	router.Run(":8080")
}
