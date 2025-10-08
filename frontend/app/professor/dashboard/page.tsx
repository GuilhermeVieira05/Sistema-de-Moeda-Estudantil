"use client"

import DashboardLayout from "@/components/dashboard-layout"
import StatCard from "@/components/stat-card"
import TransactionItem from "@/components/transaction-item"
import Button from "@/components/button"
import { useRouter } from "next/navigation"
import type { Transaction } from "@/types"

const mockProfessor = {
  name: "Prof. Maria Santos",
  balance: 2500,
}

const mockRecentTransactions: Transaction[] = [
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
]

export default function ProfessorDashboard() {
  const router = useRouter()

  return (
    <DashboardLayout userType="professor" userName={mockProfessor.name} balance={mockProfessor.balance}>
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold mb-3">Bem-vindo, {mockProfessor.name}!</h1>
          <p className="text-blue-100 text-lg">Reconheça o mérito dos seus alunos distribuindo moedas</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Saldo Disponível"
            value={mockProfessor.balance}
            icon={
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />

          <StatCard
            title="Moedas Distribuídas"
            value={7500}
            icon={
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            }
          />

          <StatCard
            title="Alunos Reconhecidos"
            value={45}
            icon={
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
          />
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-3">Reconheça seus alunos</h2>
              <p className="text-green-50 text-lg leading-relaxed">
                Envie moedas para recompensar participação, dedicação e excelência acadêmica
              </p>
            </div>
            <Button variant="secondary" onClick={() => router.push("/professor/send")}>
              <div className="flex items-center gap-2 px-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Enviar Moedas
              </div>
            </Button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Envios Recentes</h2>
            <a
              href="/professor/transactions"
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Ver extrato completo →
            </a>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200 shadow-sm">
            {mockRecentTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 shadow-sm">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-blue-900 mb-2">Sobre o sistema de moedas</h3>
              <p className="text-blue-800 leading-relaxed">
                Você recebe 1.000 moedas por semestre. O saldo não utilizado é acumulado para o próximo período.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
