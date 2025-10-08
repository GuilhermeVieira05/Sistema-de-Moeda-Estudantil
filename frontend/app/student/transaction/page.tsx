"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import TransactionItem from "@/components/transaction-item"
import type { Transaction } from "@/types"

const mockStudent = {
  name: "João Silva",
  balance: 850,
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "receive",
    amount: 100,
    date: "05/01/2025",
    description: "Participação ativa em aula",
    from: "Prof. Maria Santos",
  },
  {
    id: "2",
    type: "receive",
    amount: 50,
    date: "03/01/2025",
    description: "Trabalho excelente",
    from: "Prof. Carlos Lima",
  },
  {
    id: "3",
    type: "redeem",
    amount: 200,
    date: "02/01/2025",
    description: "Desconto Restaurante Universitário",
    to: "RU Central",
  },
  {
    id: "4",
    type: "receive",
    amount: 75,
    date: "28/12/2024",
    description: "Apresentação de seminário",
    from: "Prof. Ana Paula",
  },
  {
    id: "5",
    type: "receive",
    amount: 100,
    date: "20/12/2024",
    description: "Projeto final nota máxima",
    from: "Prof. Roberto Silva",
  },
  {
    id: "6",
    type: "redeem",
    amount: 150,
    date: "15/12/2024",
    description: "Café grátis por uma semana",
    to: "Café Central",
  },
  {
    id: "7",
    type: "receive",
    amount: 50,
    date: "10/12/2024",
    description: "Ajuda aos colegas",
    from: "Prof. Maria Santos",
  },
]

export default function StudentTransactionsPage() {
  const [filter, setFilter] = useState<"all" | "receive" | "redeem">("all")

  const filteredTransactions = mockTransactions.filter((t) => filter === "all" || t.type === filter)

  const totalReceived = mockTransactions.filter((t) => t.type === "receive").reduce((sum, t) => sum + t.amount, 0)

  const totalRedeemed = mockTransactions.filter((t) => t.type === "redeem").reduce((sum, t) => sum + t.amount, 0)

  return (
    <DashboardLayout userType="student" userName={mockStudent.name} balance={mockStudent.balance}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Extrato de Transações</h1>
          <p className="text-muted">Acompanhe todas as suas movimentações</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-border">
            <p className="text-sm text-muted mb-1">Saldo Atual</p>
            <p className="text-3xl font-bold text-primary">{mockStudent.balance}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-border">
            <p className="text-sm text-muted mb-1">Total Recebido</p>
            <p className="text-3xl font-bold text-success">+{totalReceived}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-border">
            <p className="text-sm text-muted mb-1">Total Resgatado</p>
            <p className="text-3xl font-bold text-error">-{totalRedeemed}</p>
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
              onClick={() => setFilter("receive")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "receive" ? "bg-success text-white" : "bg-surface text-muted hover:bg-border"
              }`}
            >
              Recebidas
            </button>
            <button
              onClick={() => setFilter("redeem")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "redeem" ? "bg-error text-white" : "bg-surface text-muted hover:bg-border"
              }`}
            >
              Resgatadas
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
