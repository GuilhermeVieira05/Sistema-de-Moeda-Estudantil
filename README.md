# Sistema de Moeda Estudantil

## 📋 Índice

- [Introdução](#-introdução)
- [Objetivo Principal](#-objetivo-principal)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Executar](#-como-executar)
- [Diagramas](#-diagramas)
- [Histórias de Usuário](#-histórias-de-usuário)

---

## 📖 Introdução

O **Sistema de Moeda Estudantil** é uma plataforma educacional inovadora que implementa um sistema de mérito baseado em moedas virtuais. Desenvolvido como projeto acadêmico de Laboratório de Desenvolvimento de Software, o sistema permite que professores recompensem alunos por bom desempenho, participação e conquistas acadêmicas através de uma moeda virtual que pode ser trocada por vantagens em empresas parceiras.

Esta solução promove o engajamento estudantil, incentiva o bom comportamento acadêmico e cria uma conexão entre instituições de ensino e o mercado local através de parcerias comerciais.

---

## 🎯 Objetivo Principal

Criar uma plataforma que:

- **Incentive o mérito estudantil** através de um sistema de recompensas transparente e gamificado
- **Conecte instituições de ensino, alunos e empresas parceiras** em um ecossistema colaborativo
- **Permita que professores reconheçam e recompensem** o esforço e desempenho dos alunos
- **Ofereça benefícios reais** aos estudantes através de vantagens em estabelecimentos parceiros

---

## ✨ Funcionalidades

### Para Alunos
- Consultar saldo de moedas
- Visualizar extrato de transações
- Trocar moedas por vantagens disponíveis
- Receber notificações de créditos e resgates

### Para Professores
- Distribuir moedas para alunos
- Adicionar motivo/descrição para cada distribuição
- Consultar histórico de transações realizadas

### Para Empresas Parceiras
- Cadastrar vantagens/benefícios disponíveis
- Gerenciar estoque de vantagens
- Validar resgates através de código/cupom

### Para Instituições de Ensino
- Cadastrar professores e alunos
- Gerenciar cursos e turmas
- Definir quantidade de moedas semestrais para professores

### Para Administradores
- Cadastrar instituições de ensino
- Cadastrar empresas parceiras
- Monitorar o sistema

---

## 🛠 Tecnologias Utilizadas

### Backend
- **Go (Golang)** - Linguagem principal
- **Gin** - Framework web
- **GORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação e autorização

### Frontend
- **Next.js 15** - Framework React
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de estilos
- **Material UI** - Componentes de interface

---

## 📁 Estrutura do Projeto

```
Sistema-de-Moeda-Estudantil/
├── backend/                    # API REST em Go
│   ├── adapters/              # Controllers, Repositories, Routes
│   ├── application/           # DTOs, Models, Services, Interfaces
│   ├── cmd/                   # Ponto de entrada da aplicação
│   ├── config/                # Configurações
│   ├── container/             # Injeção de dependências
│   ├── emailSender/           # Serviço de envio de emails
│   ├── middlewares/           # Middlewares de autenticação
│   └── pkg/                   # Pacotes utilitários
├── frontend/                   # Aplicação Next.js
│   ├── app/                   # Páginas e rotas
│   ├── components/            # Componentes reutilizáveis
│   ├── context/               # Contextos React
│   ├── api/                   # Serviços de API
│   └── types/                 # Definições de tipos TypeScript
└── diagramas/                  # Diagramas do sistema
    ├── Comunicacao/           # Diagramas de comunicação
    └── Sequencia/             # Diagramas de sequência
```

---

## 🚀 Como Executar

### Pré-requisitos
- Go 1.25+
- Node.js 18+
- PostgreSQL
- npm ou yarn

### Backend

```bash
cd backend
cp .env.example .env  # Configure as variáveis de ambiente
go mod download
go run cmd/main.go
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse a aplicação em [http://localhost:3000](http://localhost:3000)

---

## 📊 Diagramas

### Diagrama de Casos de Uso

<img width="795" height="669" alt="image" src="https://github.com/user-attachments/assets/6e98b0d4-a68f-4490-a6a3-12b2e76e5632" />

### Diagrama de Classes

<img width="6896" height="2583" alt="Diagrama de Classe - LAB03" src="https://github.com/user-attachments/assets/9bf9e40d-d6cc-4895-bd53-24dff831dc95" />

[Visualizar no Figma](https://www.figma.com/board/CmK9QxWPJDak5rVcVTzKj0/Diagrama-de-Classe---LAB03?node-id=0-1&t=YWsOGNXVakiB8MaR-1)

### Diagrama de Componentes

<img width="778" height="710" alt="image" src="https://github.com/user-attachments/assets/c670ed6d-5bae-4768-aca3-91fd58bcb07c" />

[Visualizar no Figma](https://www.figma.com/design/lgWPNO7PHsBxLOGAFVuVQA/Architecture-Diagram-Components--Community-?node-id=0-1&p=f&t=gWqeWhVGiXpMpVIB-0)

### Diagrama de Entidades e Relacionamentos

<img width="1451" height="451" alt="DiagramaERLab03 drawio" src="https://github.com/user-attachments/assets/f44e9390-9265-4795-9e97-09cd9d0d0ccf" />

[Visualizar no Google Drive](https://drive.google.com/file/d/1Koos8QEmCg6nSshWPby1r7_WG9Edu_FZ/view?usp=sharing)

---

## 📝 Histórias de Usuário

<p align="center">
  <img src="https://github.com/user-attachments/assets/e75fb7e1-9b69-49bd-b163-0a1a1c975af1" width="48%">
  <img src="https://github.com/user-attachments/assets/b2109e4d-02c7-4cd6-b8e1-edc587a838a7" width="48%">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/8b1b42da-b1a0-464c-82bc-9830c07a106f" width="48%">
  <img src="https://github.com/user-attachments/assets/70031a3d-cf6b-480a-8e12-c0795710a687" width="48%">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/32f26c2b-036f-49aa-b146-3ce8257c49be" width="48%">
  <img src="https://github.com/user-attachments/assets/228dde9e-2056-42be-89f5-7691e4e361f9" width="48%">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/8d7c7a63-d3f4-4889-9582-c9ea740a237e" width="48%">
  <img src="https://github.com/user-attachments/assets/eb6954da-2006-4d68-b153-d532ee42bfc1" width="48%">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/fad3792e-7867-4cb7-84bf-a9d437f6b575" width="48%">
  <img src="https://github.com/user-attachments/assets/aa01db7b-a3b2-4d57-adac-df082217a21c" width="48%">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/0c4ff447-98ff-4fec-a0b4-0a77154bd7a3" width="48%">
  <img src="https://github.com/user-attachments/assets/ae14a58c-650b-445e-b0ab-d5aea2b51f33" width="48%">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/a4d1e40b-7042-436d-9bb4-f3fdd2a9c3cf" width="48%">
  <img src="https://github.com/user-attachments/assets/70919e54-e3d8-4a04-a050-ccbe301fcaab" width="48%">
</p>

[Visualizar no Figma](https://www.figma.com/design/SZ7lTo7il8RhLdo8yuL5fY/Historias-de-Usu%C3%A1rio?node-id=0-1&t=jqgJga9469gqvyj7-1)

---

## 👥 Contribuidores

Projeto desenvolvido como parte do curso de Laboratório de Desenvolvimento de Software.

---

## 📄 Licença

Este projeto é desenvolvido para fins acadêmicos.
