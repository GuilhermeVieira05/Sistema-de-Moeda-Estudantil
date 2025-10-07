package services

import (
	// "backend/application/appErrors"
	"backend/application/interfaces"
	// "context"
	// "hash"
)

type userService struct {
	userDAO interfaces.UserDAO
}

func NewUserService(userDAO interfaces.UserDAO) *userService {
	return &userService{userDAO: userDAO}
}

// func (s *userService) RegisterUser(ctx context.Context, email, password, role string) error {
// 	existingUser, err := s.userDAO.GetUserByEmail(ctx, email)
// 	if err != nil {
// 		return err
// 	}

// 	if existingUser != nil {
// 		return appErrors.ErrAlreadyExists
// 	}

// 	// hashedPassword, err := hashPassword(password)
// }