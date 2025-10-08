"use client"

import { useState } from "react"

interface Student {
  id: string
  name: string
  email: string
  course: string
}

interface StudentSearchProps {
  onSelect: (student: Student) => void
  selectedStudent?: Student
}

const mockStudents: Student[] = [
  { id: "1", name: "João Silva", email: "joao@email.com", course: "Engenharia de Software" },
  { id: "2", name: "Maria Santos", email: "maria@email.com", course: "Ciência da Computação" },
  { id: "3", name: "Pedro Oliveira", email: "pedro@email.com", course: "Sistemas de Informação" },
  { id: "4", name: "Ana Costa", email: "ana@email.com", course: "Engenharia de Software" },
  { id: "5", name: "Carlos Lima", email: "carlos@email.com", course: "Administração" },
]

export default function StudentSearch({ onSelect, selectedStudent }: StudentSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showResults, setShowResults] = useState(false)

  const filteredStudents = mockStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelect = (student: Student) => {
    onSelect(student)
    setSearchTerm(student.name)
    setShowResults(false)
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-foreground mb-2">
        Aluno <span className="text-error">*</span>
      </label>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setShowResults(true)
        }}
        onFocus={() => setShowResults(true)}
        placeholder="Buscar aluno por nome ou email..."
        className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />

      {showResults && searchTerm && filteredStudents.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredStudents.map((student) => (
            <button
              key={student.id}
              type="button"
              onClick={() => handleSelect(student)}
              className="w-full px-4 py-3 text-left hover:bg-surface transition-colors border-b border-border last:border-b-0"
            >
              <p className="font-medium text-foreground">{student.name}</p>
              <p className="text-sm text-muted">{student.email}</p>
              <p className="text-xs text-muted">{student.course}</p>
            </button>
          ))}
        </div>
      )}

      {selectedStudent && (
        <div className="mt-3 p-3 bg-primary/10 rounded-lg">
          <p className="text-sm font-medium text-foreground">{selectedStudent.name}</p>
          <p className="text-xs text-muted">{selectedStudent.email}</p>
        </div>
      )}
    </div>
  )
}
