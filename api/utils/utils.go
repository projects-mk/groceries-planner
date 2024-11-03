package utils

import "log"

func HandleError(err error, msg string, ret any) any {
	if err != nil {
		log.Printf(`%s: %v`, msg, err)
		return ret
	}

	return nil
}
