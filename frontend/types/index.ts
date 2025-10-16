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
  balance: number
}

export interface Professor extends User {
  type: "professor"
  cpf: string
  department: string
  institution: string
  balance: number
}

export interface Company extends User {
  type: "company"
  cnpj: string
  address: string
  description: string
}

export interface Transaction {
  id: string
  type: "send" | "receive" | "redeem"
  amount: number
  date: string
  description: string
  from?: string
  to?: string
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
  name: string
  courses: string[]
}
