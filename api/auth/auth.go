package auth

import (
	"encoding/base64"
	"log"
	"os"
	"strconv"

	"golang.org/x/crypto/argon2"
)

type hashParams struct {
	Memory      uint32
	Iterations  uint32
	Parallelism uint8
	KeyLength   uint32
}

var globalHashParams hashParams

func init() {
	globalHashParams = hashParams{
		Memory:      parseEnvAsUint32("HASH_MEMORY", 64*1024), // Default 64MB Memory
		Iterations:  parseEnvAsUint32("HASH_ITERATIONS", 3),   // Default iterations = 3
		Parallelism: parseEnvAsUint8("HASH_PARALLELISM", 2),   // Default parallelism = 2
		KeyLength:   parseEnvAsUint32("HASH_LEN", 32),         // Default key length = 32 bytes
	}
}

func parseEnvAsUint32(key string, defaultVal uint32) uint32 {
	valStr := os.Getenv(key)
	if valStr == "" {
		return defaultVal
	}
	val, err := strconv.Atoi(valStr)
	if err != nil {
		log.Fatalf("Error parsing env var %s: %s", key, err)
	}
	return uint32(val)
}

func parseEnvAsUint8(key string, defaultVal uint8) uint8 {
	valStr := os.Getenv(key)
	if valStr == "" {
		return defaultVal
	}
	val, err := strconv.Atoi(valStr)
	if err != nil {
		log.Fatalf("Error parsing env var %s: %s", key, err)
	}
	return uint8(val)
}

func generateFromPassword(pass string, p *hashParams) (hash string, err error) {

	salt := os.Getenv("PASS_SALT")

	hashedPass := argon2.IDKey([]byte(pass), []byte(salt), p.Iterations, p.Memory, p.Parallelism, p.KeyLength)

	hash = base64.StdEncoding.EncodeToString(hashedPass)

	return hash, nil
}

func HashPassword(pass string) (string, error) {
	hash, err := generateFromPassword(pass, &hashParams{
		Memory:      globalHashParams.Memory,
		Iterations:  globalHashParams.Iterations,
		Parallelism: globalHashParams.Parallelism,
		KeyLength:   globalHashParams.KeyLength,
	})

	if err != nil {
		return "", err
	}

	return hash, nil
}
