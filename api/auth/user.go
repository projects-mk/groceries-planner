package auth

import (
	"database/sql"
	"log"
)

type UserCreds struct {
	Id       *int
	Email    string `json:"email" binding:"required"`
	Password string `json:"pass" binding:"required"`
}

type User struct {
	Id    int
	Email string
}

func (u UserCreds) Register(db *sql.DB) error {
	query := `INSERT INTO groceries.users (createdtime, useremail, userpass) VALUES (CURRENT_DATE, $1, $2)`
	userPass, hashErr := HashPassword(u.Password)
	if hashErr != nil {
		log.Printf("Could not create a hash: %s\n", hashErr)
		return hashErr
	}

	_, dbErr := db.Exec(query, u.Email, userPass)
	if dbErr != nil {
		log.Printf("Could not register new user: %s\n", dbErr)
		return dbErr
	}

	return nil
}

func (u UserCreds) Login(db *sql.DB) string {
	passHash, hashErr := HashPassword(u.Password)
	if hashErr != nil {
		log.Printf("Could not create a hash: %s\n", hashErr)
		return ""
	}

	query := `SELECT id, useremail, userpass FROM groceries.users WHERE useremail = $1`
	rows, err := db.Query(query, u.Email)
	if err != nil {
		log.Printf("User does not exists: %s\n", err)
		return ""
	}

	var creds []UserCreds
	for rows.Next() {
		var record UserCreds

		if err := rows.Scan(&record.Id, &record.Email, &record.Password); err != nil {
			log.Printf("User does not exists: %s\n", err)
			return ""
		}
		creds = append(creds, record)
	}

	if len(creds) > 0 {
		if creds[0].Password == string(passHash) {
			return GenerateJWTForUser(*creds[0].Id, creds[0].Email)
		}
	}

	return ""
}

func (u User) Delete(db *sql.DB) error {
	query := `DELETE FROM groceries.users WHERE id = $1`

	_, err := db.Exec(query, u.Id)
	if err != nil {
		log.Printf("Could not delete user: %s", err)
		return err
	}

	return nil
}

func (u User) VerifyUserToken(db *sql.DB) error {
	query := `SELECT * FROM groceries.users WHERE id = $1`

	resp, err := db.Exec(query, u.Id)

	nRows, _ := resp.RowsAffected()

	if err != nil || nRows == 0 {
		log.Printf("Could not find user: %s", err)
		return err
	}

	return nil
}

// func (u User) ChangePass(db *sql.DB, currentPass string, newPass string) bool {
// 	query := `UPDATE groceries.users SET userpasswrod = $1 WHERE id = $2`

// 	if !u.ValidateUserId(db, currentPass) {
// 		return false
// 	}
// 	_, err := db.Exec(query, newPass, u.Id)
// 	if err != nil {
// 		log.Printf("Could not update password for user: %s \n", err)
// 		return false
// 	}

// 	return true
// }

// func (u User) ValidateUserId(db *sql.DB, pass string) bool {
// 	passHash, hashErr := HashPassword(pass)
// 	if hashErr != nil {
// 		log.Printf("Could not create a hash: %s\n", hashErr)
// 		return false
// 	}

// 	query := `SELECT useremail, userpassword FROM groceries.users WHERE id = $1`
// 	rows, err := db.Query(query, u.Id)
// 	if err != nil {
// 		log.Printf("User does not exists: %s\n", err)
// 		return false
// 	}

// 	var creds []UserCreds
// 	for rows.Next() {
// 		var record UserCreds

// 		if err := rows.Scan(&record.Email, &record.Password); err != nil {
// 			log.Printf("User does not exists: %s\n", err)
// 			return false
// 		}
// 		creds = append(creds, record)
// 	}

// 	return creds[0].Password == string(passHash)
// }
