"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import AdvantageCard from "@/components/advantage-card"
import { Student, type Advantage } from "@/types"
import { getAlunoData, updateAluno, updateAlunoSaldo } from "@/api/alunoApi"
import LoadingSpinner from "@/components/loading-spinner"

// Os mocks (mockStudent, mockAdvantages) permanecem os mesmos...
const mockStudent = {
  name: "João Silva",
  balance: 850,
}

const mockAdvantages: Advantage[] = [
  {
    id: "1",
    companyId: "1",
    companyName: "Restaurante Universitário",
    title: "20% de desconto no RU",
    description: "Válido para almoço e jantar durante todo o mês",
    cost: 200,
    imageUrl: "/restaurant-food-variety.png",
  },
  {
    id: "2",
    companyId: "2",
    companyName: "Livraria Acadêmica",
    title: "R$ 50 em livros",
    description: "Vale-compra para qualquer livro da loja",
    cost: 500,
    imageUrl: "/bookstore-books.jpg",
  },
  {
    id: "3",
    companyId: "3",
    companyName: "Tech Store",
    title: "15% em acessórios tech",
    description: "Desconto em mouses, teclados, fones e mais",
    cost: 300,
    imageUrl: "/tech-accessories.png",
  },
  {
    id: "4",
    companyId: "4",
    companyName: "Café Central",
    title: "Café grátis por uma semana",
    description: "Um café expresso por dia durante 7 dias",
    cost: 150,
    imageUrl: "/cozy-corner-cafe.png",
  },
  {
    id: "5",
    companyId: "5",
    companyName: "Academia Fitness",
    title: "1 mês de academia",
    description: "Acesso completo à academia por 30 dias",
    cost: 800,
    imageUrl: "/gym-fitness.jpg",
  },
  {
    id: "6",
    companyId: "6",
    companyName: "Cinema Plus",
    title: "2 ingressos de cinema",
    description: "Válido para qualquer sessão, exceto estreias",
    cost: 400,
    imageUrl: "/classic-movie-theater.png",
  },
]

export default function StudentAdvantagesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [aluno, setAluno] = useState<Student | null>(null)
  const [redeemingId, setRedeemingId] = useState<string | null>(null) 

  useEffect(() => {
    const fetchAluno = async () => {
      try {
        const alunoBuscado = await getAlunoData()
        console.log(alunoBuscado)
        if (alunoBuscado === null) {
          setAluno(null)
        } else {
          setAluno(alunoBuscado)
        }
      } catch (err: any) {
        console.error("Erro ao buscar aluno:", err)
        setAluno(null)
      }
    }

    fetchAluno()
  }, [])

  const filteredAdvantages = mockAdvantages.filter((advantage) => {
    const matchesSearch =
      advantage.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advantage.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

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
    if (!confirmed) {
      return
    }

    setRedeemingId(advantage.id) // Ativa o loading

    try {
      const valorDebito = -advantage.cost;

      const alunoAtualizado = await updateAlunoSaldo(valorDebito);

      setAluno(alunoAtualizado);

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

  if (!aluno) {
    return <LoadingSpinner />
  }

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

        {/* Advantages Grid */}
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

        {filteredAdvantages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted">Nenhuma vantagem encontrada</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}