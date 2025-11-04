"use client"

import { useState, useEffect } from "react"

interface Student {
  id: string
  nome: string
  email: string
  course: string
}

interface StudentSearchProps {
  onSelect: (student: Student) => void
  selectedStudent?: Student
}

export default function StudentSearch({ onSelect, selectedStudent }: StudentSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)

  // Buscar alunos conforme o prefixo digitado
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const fetchStudents = async () => {
      try {
        setLoading(true)
        setError("")

        const token = localStorage.getItem("token")
        console.log("Token:", token)
        if (!token) throw new Error("Token não encontrado")

        const res = await fetch(`http://localhost:8080/api/professor/prefix?prefix=${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || "Erro ao buscar alunos")
        }

        const data = await res.json()
        setResults(data)
        setShowDropdown(true)
      } catch (err: any) {
        setError(err.message || "Erro ao buscar alunos")
      } finally {
        setLoading(false)
      }
    }

    const delayDebounce = setTimeout(fetchStudents, 400) // espera 400ms antes de buscar
    return () => clearTimeout(delayDebounce)
  }, [query])

  const handleSelect = (student: Student) => {
    onSelect(student)
    setQuery(student.nome)
    setShowDropdown(false)
  }

  const handleClear = () => {
    setQuery("")
    onSelect(undefined as any)
    setResults([])
  }

  return (
    <div className="relative">
      <label className="text-sm font-medium leading-none mb-1 block">Buscar aluno</label>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setShowDropdown(true)
        }}
        placeholder="Digite o nome do aluno..."
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
      />

      {loading && <p className="text-sm text-gray-500 mt-1">Buscando...</p>}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

      {/* Dropdown */}
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-md mt-1 max-h-56 overflow-auto">
          {results.map((student) => (
            <li
              key={student.id}
              onClick={() => handleSelect(student)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              <div className="font-medium">{student.nome}</div>
              <div className="text-sm text-gray-500">{student.email}</div>
            </li>
          ))}
        </ul>
      )}

      {selectedStudent && (
        <div className="flex items-center justify-between mt-2 bg-gray-50 border rounded-md px-3 py-2">
          <div>
            <p className="font-medium">{selectedStudent.nome}</p>
            <p className="text-sm text-gray-600">{selectedStudent.email}</p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-red-500 text-sm hover:underline"
          >
            Remover
          </button>
        </div>
      )}
    </div>
  )
}
