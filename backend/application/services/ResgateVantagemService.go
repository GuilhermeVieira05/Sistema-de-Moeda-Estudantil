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
    resgateRepo     *repositories.ResgateVantagemRepository
    alunoRepo       *repositories.AlunoRepository
    vantagemRepo    *repositories.VantagemRepository
    emailService    *EmailService
    transacaoRepo   *repositories.TransacaoMoedaRepository 
}

func NewResgateVantagemService(
    resgateRepo *repositories.ResgateVantagemRepository,
    alunoRepo *repositories.AlunoRepository,
    vantagemRepo *repositories.VantagemRepository,
    emailService *EmailService,
    transacaoRepo *repositories.TransacaoMoedaRepository,
) *ResgateVantagemService {
    return &ResgateVantagemService{
        resgateRepo:  resgateRepo,
        alunoRepo:    alunoRepo,
        vantagemRepo: vantagemRepo,
        emailService: emailService,
        transacaoRepo: transacaoRepo,
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

    if aluno.SaldoMoedas < vantagem.CustoMoedas {
        return nil, errors.New("saldo insuficiente")
    }

    aluno.SaldoMoedas -= vantagem.CustoMoedas
    if err := s.alunoRepo.Update(aluno); err != nil {
        return nil, fmt.Errorf("erro ao atualizar saldo do aluno: %w", err)
    }

    codigoCupom := s.gerarCodigoCupom()

    resgate := &model.ResgateVantagem{
        AlunoID:     aluno.ID,
        VantagemID:  vantagemID,
        DataHora:    time.Now(),
        CodigoCupom: codigoCupom,
        Status:      "pendente",
    }

    if err := s.resgateRepo.Create(resgate); err != nil {
        aluno.SaldoMoedas += vantagem.CustoMoedas
        _ = s.alunoRepo.Update(aluno)
        return nil, fmt.Errorf("erro ao registrar resgate da vantagem: %w", err)
    }

    // ---------------------------------------------------------------
    // NOVO: Gerar Transação de Débito para o extrato do Aluno
    // ---------------------------------------------------------------
    transacao := &model.TransacaoMoeda{
        AlunoID:     &aluno.ID,
        Valor:       int(vantagem.CustoMoedas), 
        Motivo:      fmt.Sprintf("Resgate da vantagem: %s", vantagem.Titulo),
    }

    if err := s.transacaoRepo.Create(transacao); err != nil {
        fmt.Printf("ERRO: Falha ao registrar transação de débito para o aluno %d ao resgatar vantagem %d: %v\n", aluno.ID, vantagemID, err)
    }

    go s.emailService.SendCupomResgate(aluno.User.Email, aluno.Nome, vantagem.Titulo, codigoCupom)

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
    id := uuid.New()
    return fmt.Sprintf("CUPOM-%s", id.String()[:8])
}