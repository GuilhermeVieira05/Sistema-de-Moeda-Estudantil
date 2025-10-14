package container

import (
	"backend/adapters/controllers"
	"backend/adapters/repositories"
	"backend/application/services"
	"backend/config"

	"gorm.io/gorm"
)

type Container struct {
	UserController        *controllers.UserController
	AlunoController       *controllers.AlunoController
	ProfessorController   *controllers.ProfessorController
	EmpresaController     *controllers.EmpresaParceiraController
	InstituicaoController *controllers.InstituicaoEnsinoController
	VantagemController    *controllers.VantagemController

	Config *config.Config
}

func NewContainer(db *gorm.DB, cfg *config.Config) *Container {

	alunoRepo := repositories.NewAlunoRepository(db)
	userRepo := repositories.NewUserRepository(db)
	empresaRepo := repositories.NewEmpresaParceiraRepository(db)
	professorRepo := repositories.NewProfessorRepository(db)
	resgateVantagemRepo := repositories.NewResgateVantagemRepository(db)
	transacaoMoedaRepo := repositories.NewTransacaoMoedaRepository(db)
	vantagemRepo := repositories.NewVantagemRepository(db)
	instituicaoRepo := repositories.NewInstituicaoEnsinoRepository(db)

	emailService := services.NewEmailService(cfg)
	alunoService := services.NewAlunoService(alunoRepo, userRepo, emailService)
	userService := services.NewUserService(userRepo, cfg)
	empresaService := services.NewEmpresaParceiraService(empresaRepo, userRepo)
	professorService := services.NewProfessorService(professorRepo, userRepo)
	resgateVantagemService := services.NewResgateVantagemService(resgateVantagemRepo, alunoRepo, vantagemRepo, emailService)
	transacaoMoedaService := services.NewTransacaoMoedaService(transacaoMoedaRepo, professorRepo, alunoRepo, emailService)
	vantagemService := services.NewVantagemService(vantagemRepo, empresaRepo)

	userController := controllers.NewUserController(userService)
	alunoController := controllers.NewAlunoController(alunoService)
	professorController := controllers.NewProfessorController(professorService, transacaoMoedaService)
	empresaController := controllers.NewEmpresaParceiraController(empresaService, vantagemService)
	instituicaoController := controllers.NewInstituicaoEnsinoController(instituicaoRepo)
	vantagemController := controllers.NewVantagemController(vantagemService, resgateVantagemService)

	return &Container{
		UserController:        userController,
		AlunoController:       alunoController,
		ProfessorController:   professorController,
		EmpresaController:     empresaController,
		InstituicaoController: instituicaoController,
		VantagemController:    vantagemController,
		Config:                cfg,
	}

}
