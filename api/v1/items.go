package v1

import (
	"database/sql"
	"fmt"
)

type Item struct {
	ID          int16  `json:"id"`
	CreatedTime string `json:"createdTime"`
	Product     string `json:"product"`
	InBasket    bool   `json:"inBasket"`
	UserId      string `json:"userId"`
}

func ListItems(userId string, db *sql.DB) []Item {

	query := fmt.Sprintf(`SELECT * FROM groceries.main WHERE userId = '%s' ORDER BY "createdtime" DESC`, userId)

	rows, err := db.Query(query)
	if err != nil {
		fmt.Printf("Database error: %s\n", err)
		return []Item{}
	}
	defer rows.Close()

	var items []Item

	for rows.Next() {
		var record Item

		if err := rows.Scan(&record.ID, &record.CreatedTime, &record.Product, &record.InBasket, &record.UserId); err != nil {
			fmt.Printf("Scan error: %s\n", err)
			return []Item{}
		}

		items = append(items, record)
	}

	if err := rows.Err(); err != nil {
		fmt.Printf("Row iteration error: %s\n", err)
		return []Item{}
	}

	return items
}

func AddItem(product string, userId string, db *sql.DB) string {

	if product == "" {
		return "Product name must be provided"
	}

	query := `INSERT INTO groceries.main (createdtime, product, inbasket, userid) VALUES (CURRENT_DATE, $1, false, $2)`
	_, err := db.Exec(query, product, userId)
	if err != nil {
		return fmt.Sprintf("Can't add item: %s", err)
	}

	return "Item added successfully"
}

func DeleteItem(productId int, userId string, db *sql.DB) string {

	result, err := db.Exec(`DELETE FROM groceries.main WHERE id = $1 AND userid = $2`, productId, userId)
	if err != nil {
		fmt.Printf("Can't delete item: %s", err)
		return fmt.Sprintf("Can't delete item: %s", err)

	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Sprintf("Error checking rows affected: %s", err)
	}

	if rowsAffected == 0 {
		return "Item not found"
	}

	return "Item deleted successfully"
}

func UpdateBasket(productId int, userId string, method string, db *sql.DB) string {

	var inBasket bool
	switch method {
	case "in":
		inBasket = true
	case "out":
		inBasket = false
	default:
		return "Invalid 'method' value; must be 'in' or 'out'"
	}

	query := `UPDATE groceries.main SET inbasket = $1 WHERE id = $2 AND userId = $3`
	_, err := db.Exec(query, inBasket, productId, userId)
	if err != nil {
		fmt.Printf("Can't update item: %s", err)
		return fmt.Sprintf("Can't update item: %s", err)
	}

	return "OK"
}
