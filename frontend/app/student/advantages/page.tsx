"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import AdvantageCard from "@/components/advantage-card"
import type { Advantage } from "@/types"

const mockStudent = {
  name: "João Silva",
  balance: 8500, // ajustei pra testar com valores altos
}

export default function StudentAdvantagesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [advantages, setAdvantages] = useState<Advantage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 🔹 Buscar vantagens do backend
  useEffect(() => {
    const fetchAdvantages = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/vantagens")
        if (!response.ok) {
          throw new Error(`Erro ao buscar vantagens: ${response.status}`)
        }

        const data = await response.json()

        // 🔹 Mapeia os dados do backend para o formato do componente
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
    if (mockStudent.balance < advantage.cost) {
      alert("Saldo insuficiente para resgatar esta vantagem.")
      return
    }

    try {
      const token = localStorage.getItem("token") 
    
      const response = await fetch("http://localhost:8080/api/aluno/resgatar-vantagem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          vantagem_id: Number(advantage.id),
        }),
      })
    
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Falha ao resgatar vantagem")
      }
    
      const data = await response.json()
      alert(`🎉 Vantagem resgatada com sucesso!\n\nCódigo do cupom: ${data.resgate?.codigo_cupom || "N/A"}`)
    } catch (error: any) {
      alert(`❌ Erro: ${error.message}`)
    }
    
  }

  return (
    <DashboardLayout userType="student" userName={mockStudent.name} balance={mockStudent.balance}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Vantagens Disponíveis</h1>
          <p className="text-muted">Resgate vantagens incríveis com suas moedas</p>
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
                userBalance={mockStudent.balance}
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
