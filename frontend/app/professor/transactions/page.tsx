"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import TransactionItem from "@/components/transaction-item"
import type { Transaction } from "@/types"

const mockProfessor = {
  name: "Prof. Maria Santos",
  balance: 2500,
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "send",
    amount: 100,
    date: "05/01/2025",
    description: "Participação ativa em aula",
    to: "João Silva",
  },
  {
    id: "2",
    type: "send",
    amount: 50,
    date: "03/01/2025",
    description: "Trabalho excelente",
    to: "Maria Santos",
  },
  {
    id: "3",
    type: "send",
    amount: 75,
    date: "02/01/2025",
    description: "Apresentação de seminário",
    to: "Pedro Oliveira",
  },
  {
    id: "4",
    type: "receive",
    amount: 1000,
    date: "01/01/2025",
    description: "Crédito semestral",
    from: "Sistema",
  },
  {
    id: "5",
    type: "send",
    amount: 100,
    date: "28/12/2024",
    description: "Projeto final nota máxima",
    to: "Ana Costa",
  },
  {
    id: "6",
    type: "send",
    amount: 50,
    date: "20/12/2024",
    description: "Ajuda aos colegas",
    to: "Carlos Lima",
  },
  {
    id: "7",
    type: "send",
    amount: 75,
    date: "15/12/2024",
    description: "Pesquisa bem elaborada",
    to: "João Silva",
  },
  {
    id: "8",
    type: "receive",
    amount: 1000,
    date: "01/08/2024",
    description: "Crédito semestral",
    from: "Sistema",
  },
]

export default function ProfessorTransactionsPage() {
  const [filter, setFilter] = useState<"all" | "send" | "receive">("all")

  const filteredTransactions = mockTransactions.filter((t) => filter === "all" || t.type === filter)

  const totalSent = mockTransactions.filter((t) => t.type === "send").reduce((sum, t) => sum + t.amount, 0)

  const totalReceived = mockTransactions.filter((t) => t.type === "receive").reduce((sum, t) => sum + t.amount, 0)

  return (
    <DashboardLayout userType="professor" userName={mockProfessor.name} balance={mockProfessor.balance}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Extrato de Transações</h1>
          <p className="text-muted">Acompanhe todas as suas movimentações</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-border">
            <p className="text-sm text-muted mb-1">Saldo Atual</p>
            <p className="text-3xl font-bold text-primary">{mockProfessor.balance}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-border">
            <p className="text-sm text-muted mb-1">Total Distribuído</p>
            <p className="text-3xl font-bold text-error">-{totalSent}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-border">
            <p className="text-sm text-muted mb-1">Total Recebido</p>
            <p className="text-3xl font-bold text-success">+{totalReceived}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-border">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all" ? "bg-primary text-white" : "bg-surface text-muted hover:bg-border"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter("send")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "send" ? "bg-error text-white" : "bg-surface text-muted hover:bg-border"
              }`}
            >
              Enviadas
            </button>
            <button
              onClick={() => setFilter("receive")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "receive" ? "bg-success text-white" : "bg-surface text-muted hover:bg-border"
              }`}
            >
              Recebidas
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl border border-border divide-y divide-border">
          {filteredTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted">Nenhuma transação encontrada</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
