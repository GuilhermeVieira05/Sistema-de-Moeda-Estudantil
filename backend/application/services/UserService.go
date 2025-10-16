package services

import (
	"backend/adapters/repositories"
	"backend/application/model"
	"backend/config"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserService struct {
	userRepo *repositories.UserRepository
	config   *config.Config
	DB       *gorm.DB
}


func (s *UserService) HashPassword(password string) (any, any) {
	panic("unimplemented")
}

func NewUserService(userRepo *repositories.UserRepository, cfg *config.Config, db *gorm.DB) *UserService {
	return &UserService{
		userRepo: userRepo,
		config:   cfg,
		DB:       db,
	}
}


func (s *UserService) Login(email, password string) (string, *model.User, error) {
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", nil, errors.New("credenciais inválidas")
		}
		return "", nil, err
	}

	// Verificar senha
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return "", nil, errors.New("credenciais inválidas")
	}

	// Gerar token JWT
	token, err := s.generateToken(user)
	if err != nil {
		return "", nil, err
	}

	return token, user, nil
}

func (s *UserService) CreateUser(email, password, role string) (*model.User, error) {
	// Verificar se usuário já existe
	existingUser, err := s.userRepo.FindByEmail(email)
	if err == nil && existingUser != nil {
		return nil, errors.New("email já cadastrado")
	}

	// Hash da senha
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &model.User{
		Email:        email,
		PasswordHash: string(hashedPassword),
		Role:         role,
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *UserService) generateToken(user *model.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 dias
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.config.JWTSecret))
}
