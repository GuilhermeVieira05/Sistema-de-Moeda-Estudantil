package services

import (
	"backend/adapters/repositories"
	"backend/application/model"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
)

type ResgateVantagemService struct {
	resgateRepo  *repositories.ResgateVantagemRepository
	alunoRepo    *repositories.AlunoRepository
	vantagemRepo *repositories.VantagemRepository
	emailService *EmailService
}

func NewResgateVantagemService(
	resgateRepo *repositories.ResgateVantagemRepository,
	alunoRepo *repositories.AlunoRepository,
	vantagemRepo *repositories.VantagemRepository,
	emailService *EmailService,
) *ResgateVantagemService {
	return &ResgateVantagemService{
		resgateRepo:  resgateRepo,
		alunoRepo:    alunoRepo,
		vantagemRepo: vantagemRepo,
		emailService: emailService,
	}
}

func (s *ResgateVantagemService) ResgatarVantagem(userID, vantagemID uint) (*model.ResgateVantagem, error) {
	// Buscar aluno pelo user_id (do JWT)
	aluno, err := s.alunoRepo.FindByUserID(userID)
	if err != nil {
		return nil, errors.New("aluno não encontrado")
	}

	// Buscar vantagem
	vantagem, err := s.vantagemRepo.FindByID(vantagemID)
	if err != nil {
		return nil, errors.New("vantagem não encontrada")
	}

	// Verificar se vantagem está ativa
	if !vantagem.Ativa {
		return nil, errors.New("vantagem não está disponível")
	}

	// Verificar saldo do aluno
	if aluno.SaldoMoedas < vantagem.CustoMoedas {
		return nil, errors.New("saldo insuficiente")
	}

	// Descontar moedas do aluno
	aluno.SaldoMoedas -= vantagem.CustoMoedas
	if err := s.alunoRepo.Update(aluno); err != nil {
		return nil, err
	}

	// Gerar código do cupom
	codigoCupom := s.gerarCodigoCupom()

	// Criar resgate usando aluno.ID (FK correta)
	resgate := &model.ResgateVantagem{
		AlunoID:     aluno.ID,
		VantagemID:  vantagemID,
		DataHora:    time.Now(),
		CodigoCupom: codigoCupom,
		Status:      "pendente",
	}

	if err := s.resgateRepo.Create(resgate); err != nil {
		// Reverter saldo do aluno em caso de erro
		aluno.SaldoMoedas += vantagem.CustoMoedas
		s.alunoRepo.Update(aluno)
		return nil, err
	}

	// Enviar email para o aluno com o cupom
	go s.emailService.SendCupomResgate(aluno.User.Email, aluno.Nome, vantagem.Titulo, codigoCupom)

	// Enviar email para a empresa parceira
	go s.emailService.SendNotificacaoEmpresa(
		vantagem.EmpresaParceira.User.Email,
		vantagem.EmpresaParceira.Nome,
		aluno.Nome,
		vantagem.Titulo,
		codigoCupom,
	)

	return resgate, nil
}


func (s *ResgateVantagemService) GetResgatesAluno(alunoID uint) ([]model.ResgateVantagem, error) {
	return s.resgateRepo.FindByAlunoID(alunoID)
}

func (s *ResgateVantagemService) GetResgatesEmpresa(empresaID uint) ([]model.ResgateVantagem, error) {
	return s.resgateRepo.FindByEmpresaID(empresaID)
}

func (s *ResgateVantagemService) gerarCodigoCupom() string {
	// Gerar código único usando UUID
	id := uuid.New()
	return fmt.Sprintf("CUPOM-%s", id.String()[:8])
}
