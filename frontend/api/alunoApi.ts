import { Student } from "@/types";
import apiUrl from "./apiUrl";

export async function getAlunoData(): Promise<Student> {
  const url = `${apiUrl}/aluno/perfil`;

  const token = localStorage.getItem('token');

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData: { error: string } = await response.json();
    throw new Error(`Erro ${response.status}: ${errorData.error || 'Falha ao buscar dados do aluno'}`);
  }

  const alunoData: Student = await response.json();
  return alunoData;
}