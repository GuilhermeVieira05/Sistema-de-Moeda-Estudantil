"use client"

import DashboardLayout from "@/components/dashboard-layout"
import StatCard from "@/components/stat-card"
import AdvantageCard from "@/components/advantage-card"
import TransactionItem from "@/components/transaction-item"
import { Student, type Advantage, type Transaction } from "@/types"
import { getAlunoData } from "@/api/alunoApi"
import { useEffect, useState } from "react"
import LoadingSpinner from "@/components/loading-spinner"

// Mock data
const mockStudent = {
  name: "João Silva",
  balance: 850,
}

const mockRecentTransactions: Transaction[] = [
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
]

const mockFeaturedAdvantages: Advantage[] = [
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
]

export default function StudentDashboard() {
  const [aluno, setAluno] = useState<Student|null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const handleRedeem = (advantage: Advantage) => {
    alert(`Resgatando: ${advantage.title}`)
  }

   useEffect(() => {
    const fetchAluno = async () => {
      setIsLoading(true);
      setError(null); 

      try {
        const alunoBuscado = await getAlunoData(); 

        if(alunoBuscado === null) {
          setError("Não foi possível carregar os dados do aluno.");
          setAluno(null);
        } else {
          console.log("Dados do aluno buscados:", alunoBuscado); 
          setAluno(alunoBuscado); 
        }
      } catch (err: any) {
        console.error("Erro ao buscar aluno:", err);
        setError(err.message || "Ocorreu um erro desconhecido ao carregar os dados.");
        setAluno(null);
      } finally {
        setIsLoading(false); 
      }
    }
    fetchAluno()
  }, []) 


  const handleName = (name: string) => {
     let splitName = name.split(" ")
     console.log(splitName)
     if (splitName.length > 1) {
       return splitName[0] + " " + splitName.at(-1)
     } else {
       return splitName[0]
     }
  }

  if(isLoading) {
    return <LoadingSpinner />
  }

  if(!aluno) {
    return <div>Não foi possível carregar os dados do aluno.</div>
  }

  return (
    <DashboardLayout userType="student" userName={handleName(aluno.nome)} balance={mockStudent.balance}>
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold mb-3">Bem-vindo, {handleName(aluno.nome)}!</h1>
          <p className="text-blue-100 text-lg">Acompanhe seu saldo e resgate vantagens incríveis</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Saldo Atual"
            value={mockStudent.balance}
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
            trend={{ value: "+150 este mês", positive: true }}
          />

          <StatCard
            title="Moedas Recebidas"
            value={1250}
            icon={
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            }
          />

          <StatCard
            title="Vantagens Resgatadas"
            value={8}
            icon={
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            }
          />
        </div>

        {/* Featured Advantages */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Vantagens em Destaque</h2>
            <a href="/student/advantages" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              Ver todas →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockFeaturedAdvantages.map((advantage) => (
              <AdvantageCard
                key={advantage.id}
                advantage={advantage}
                onRedeem={handleRedeem}
                userBalance={mockStudent.balance}
              />
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Transações Recentes</h2>
            <a
              href="/student/transactions"
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
      </div>
    </DashboardLayout>
  )
}
