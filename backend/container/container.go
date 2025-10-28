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
	InstituicaoController *controllers.InstituicaoController
	VantagemController    *controllers.VantagemController
	ParceriaController    *controllers.ParceriaController // ADICIONADO

	Config *config.Config
}

func NewContainer(db *gorm.DB, cfg *config.Config) *Container {

	// --- Repositories ---
	alunoRepo := repositories.NewAlunoRepository(db)
	userRepo := repositories.NewUserRepository(db)
	empresaRepo := repositories.NewEmpresaParceiraRepository(db)
	professorRepo := repositories.NewProfessorRepository(db)
	resgateVantagemRepo := repositories.NewResgateVantagemRepository(db)
	transacaoMoedaRepo := repositories.NewTransacaoMoedaRepository(db)
	vantagemRepo := repositories.NewVantagemRepository(db)
	instituicaoRepo := repositories.NewInstituicaoEnsinoRepository(db)
	parceriaRepo := repositories.NewParceriaRepository(db) // ADICIONADO

	// --- Services ---
	emailService := services.NewEmailService(cfg)
	alunoService := services.NewAlunoService(alunoRepo, userRepo, emailService)
	userService := services.NewUserService(userRepo, cfg, db)
	empresaService := services.NewEmpresaParceiraService(empresaRepo, userRepo)
	
    // CORRIGIDO: Dependências do ProfessorService
	professorService := services.NewProfessorService(professorRepo, alunoRepo, transacaoMoedaRepo)
	
    resgateVantagemService := services.NewResgateVantagemService(resgateVantagemRepo, alunoRepo, vantagemRepo, emailService)
	// transacaoMoedaService := services.NewTransacaoMoedaService(transacaoMoedaRepo, professorRepo, alunoRepo, emailService)
	vantagemService := services.NewVantagemService(vantagemRepo, empresaRepo)
	
    // ADICIONADO: InstituicaoService e ParceriaService
	instituicaoService := services.NewInstituicaoService(db, instituicaoRepo, professorRepo, userRepo, parceriaRepo)
	parceriaService := services.NewParceriaService(parceriaRepo)

	// --- Controllers ---
	userController := controllers.NewUserController(userService, alunoService, empresaService)
	alunoController := controllers.NewAlunoController(alunoService)
	
    // CORRIGIDO: Dependências do ProfessorController
	professorController := controllers.NewProfessorController(professorService)
	
    empresaController := controllers.NewEmpresaParceiraController(empresaService, vantagemService)
	
    // CORRIGIDO: InstituicaoController usa o Service
	instituicaoController := controllers.NewInstituicaoController(instituicaoService)
	
    vantagemController := controllers.NewVantagemController(vantagemService, resgateVantagemService)
	
    // ADICIONADO: ParceriaController
	parceriaController := controllers.NewParceriaController(parceriaService)

	return &Container{
		UserController:        userController,
		AlunoController:       alunoController,
		ProfessorController:   professorController,
		EmpresaController:     empresaController,
		InstituicaoController: instituicaoController,
		VantagemController:    vantagemController,
		ParceriaController:    parceriaController, // ADICIONADO
		Config:                cfg,
	}

}