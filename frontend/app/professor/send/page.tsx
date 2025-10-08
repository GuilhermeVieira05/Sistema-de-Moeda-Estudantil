"use client"

import type React from "react"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import TextField from "@/components/text-field"
import Button from "@/components/button"
import StudentSearch from "@/components/student-search"
import { useRouter } from "next/navigation"

interface Student {
  id: string
  name: string
  email: string
  course: string
}

const mockProfessor = {
  name: "Prof. Maria Santos",
  balance: 2500,
}

export default function ProfessorSendPage() {
  const router = useRouter()
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>()
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validações
    if (!selectedStudent) {
      setError("Selecione um aluno")
      return
    }

    const amountNum = Number.parseInt(amount)
    if (!amountNum || amountNum <= 0) {
      setError("Digite um valor válido")
      return
    }

    if (amountNum > mockProfessor.balance) {
      setError("Saldo insuficiente")
      return
    }

    if (!reason.trim()) {
      setError("O motivo é obrigatório")
      return
    }

    setLoading(true)

    // Simulação de envio
    setTimeout(() => {
      alert(
        `Moedas enviadas com sucesso!\n\nAluno: ${selectedStudent.name}\nValor: ${amountNum}\nMotivo: ${reason}\n\nO aluno receberá uma notificação por email.`,
      )
      router.push("/professor/dashboard")
    }, 1000)
  }

  return (
    <DashboardLayout userType="professor" userName={mockProfessor.name} balance={mockProfessor.balance}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Enviar Moedas</h1>
          <p className="text-muted">Reconheça o mérito dos seus alunos</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-6 text-white">
          <p className="text-white/80 text-sm mb-1">Seu saldo disponível</p>
          <p className="text-4xl font-bold">{mockProfessor.balance}</p>
          <p className="text-white/80 text-sm mt-2">moedas</p>
        </div>

        {/* Send Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 border border-border space-y-6">
          <StudentSearch onSelect={setSelectedStudent} selectedStudent={selectedStudent} />

          <TextField
            label="Quantidade de moedas"
            type="number"
            value={amount}
            onChange={setAmount}
            placeholder="Ex: 100"
            required
          />

          <TextField
            label="Motivo do reconhecimento"
            value={reason}
            onChange={setReason}
            placeholder="Ex: Excelente participação em aula e trabalho bem elaborado"
            multiline
            rows={4}
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/professor/dashboard")} fullWidth>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} fullWidth>
              {loading ? "Enviando..." : "Enviar Moedas"}
            </Button>
          </div>
        </form>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Dicas para reconhecimento</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Seja específico no motivo do reconhecimento</li>
                <li>Reconheça comportamentos que deseja incentivar</li>
                <li>O aluno receberá um email com sua mensagem</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
