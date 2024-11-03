package auth

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type ParsedClaims struct {
	UserId    int    `json:"userId"`
	UserEmail string `json:"userEmail"`
	Exp       int64  `json:"exp"`
	jwt.RegisteredClaims
}

func GenerateJWTForUser(id int, email string) string {

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, ParsedClaims{
		UserId:    id,
		UserEmail: email,
		Exp:       time.Now().Add(time.Hour * 24).Unix(),
	})

	signedToken, err := token.SignedString([]byte(os.Getenv("JWT_KEY")))
	if err != nil {
		log.Printf("Could not Sign a token: %s\n", err.Error())
		return ""
	}

	return signedToken
}

func ParseJWT(t string) (*ParsedClaims, error) {
	claims := &ParsedClaims{}

	_, err := jwt.ParseWithClaims(t, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("could not parse token")
		}
		return []byte(os.Getenv("JWT_KEY")), nil
	})

	if err != nil {
		return nil, fmt.Errorf("could not parse token")
	}

	return claims, nil
}
