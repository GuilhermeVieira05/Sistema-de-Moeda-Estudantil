export type UserType = "student" | "professor" | "company"

export interface User {
  id: string
  email: string
  nome: string
  type: UserType
}

export interface Student extends User {
  type: "student"
  cpf: string
  rg: string
  address: string
  institution: string
  course: string
  saldo_moedas: number
}

export interface Professor extends User {
  type: "professor"
  cpf: string
  department: string
  institution: string
  saldo_moedas: number
}

export interface Company extends User {
  type: "company"
  cnpj: string
  address: string
  description: string
}

export interface Transaction {
  amount: number
  id: string
  alunoId?: string
  professorId?: string
  aluno?: Student
  professor?: Professor
  valor?: number
  motivo?: string
  data: string
  type?: "send" | "receive"
}

export interface Advantage {
  id: string
  companyId: string
  companyName: string
  title: string
  description: string
  cost: number
  imageUrl: string
}

export interface Redemption {
  id: string
  advantageId: string
  advantageTitle: string
  studentName: string
  studentEmail: string
  date: string
  code: string
  status: "pending" | "completed" | "cancelled"
}

export interface Institution {
  id: string
  nome: string
  courses: string[]
}
