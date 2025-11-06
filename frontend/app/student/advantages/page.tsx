"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import AdvantageCard from "@/components/advantage-card"
import { Student, type Advantage } from "@/types"
import { getAlunoData, updateAlunoSaldo } from "@/api/alunoApi"
import LoadingSpinner from "@/components/loading-spinner"

export default function StudentAdvantagesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [aluno, setAluno] = useState<Student | null>(null)
  const [advantages, setAdvantages] = useState<Advantage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [redeemingId, setRedeemingId] = useState<string | null>(null)

  // 🔹 Buscar dados do aluno
  useEffect(() => {
    const fetchAluno = async () => {
      try {
        const alunoBuscado = await getAlunoData()
        setAluno(alunoBuscado)
      } catch (err: any) {
        console.error("Erro ao buscar aluno:", err)
        setAluno(null)
      }
    }

    fetchAluno()
  }, [])

  // 🔹 Buscar vantagens do backend
  useEffect(() => {
    const fetchAdvantages = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/vantagens")
        if (!response.ok) throw new Error(`Erro ao buscar vantagens: ${response.status}`)
        const data = await response.json()
        const mappedAdvantages: Advantage[] = data.map((item: any) => ({
          id: String(item.ID),
          companyId: String(item.empresa_parceira_id),
          companyName: item.empresa_parceira?.nome || "Empresa Parceira",
          title: item.titulo,
          description: item.descricao,
          cost: Number(item.custo_moedas),
          imageUrl: item.foto_url || "/default.png",
        }))

        setAdvantages(mappedAdvantages)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAdvantages()
  }, [])

  // 🔎 Filtro de busca
  const filteredAdvantages = advantages.filter((advantage) => {
    const matchesSearch =
      advantage.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advantage.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  // 🎁 Resgatar vantagem
  const handleRedeem = async (advantage: Advantage) => {
    if (redeemingId) return
    if (!aluno) {
      alert("Erro: Dados do aluno não carregados. Tente recarregar a página.")
      return
    }

    if (aluno.saldo_moedas < advantage.cost) {
      alert("Saldo insuficiente para resgatar esta vantagem.")
      return
    }

    const confirmed = confirm(
      `Você tem certeza que quer resgatar "${advantage.title}" por ${advantage.cost} moedas?`,
    )
    if (!confirmed) return

    setRedeemingId(advantage.id)

    try {
      const valorDebito = -advantage.cost
      const alunoAtualizado = await updateAlunoSaldo(valorDebito)
      setAluno(alunoAtualizado)

      alert(
        `Vantagem "${advantage.title}" resgatada com sucesso!\n\nUm email com o cupom será enviado para você!`,
      )
    } catch (err: any) {
      console.error("Erro ao resgatar vantagem:", err)
      alert(err.message || "Não foi possível resgatar a vantagem. Tente novamente.")
    } finally {
      setRedeemingId(null)
    }
  }

  if (!aluno) return <LoadingSpinner />

  return (
    <DashboardLayout userType="student" userName={aluno.nome} balance={aluno.saldo_moedas}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Vantagens Disponíveis</h1>
          <p className="text-gray-500">Resgate vantagens incríveis com suas moedas</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar vantagens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              <option value="all">Todas as categorias</option>
              <option value="food">Alimentação</option>
              <option value="education">Educação</option>
              <option value="tech">Tecnologia</option>
              <option value="entertainment">Entretenimento</option>
            </select>
          </div>
        </div>

        {/* Loading & Errors */}
        {loading && <p className="text-center text-muted">Carregando vantagens...</p>}
        {error && <p className="text-center text-red-500">Erro: {error}</p>}

        {/* Advantages Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdvantages.map((advantage) => (
              <AdvantageCard
                key={advantage.id}
                advantage={advantage}
                onRedeem={handleRedeem}
                userBalance={aluno.saldo_moedas}
                isLoading={redeemingId === advantage.id}
              />
            ))}
          </div>
        )}

        {!loading && filteredAdvantages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted">Nenhuma vantagem encontrada</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
