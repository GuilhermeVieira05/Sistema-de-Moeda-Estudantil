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
  console.log(response)

  if (!response.ok) {
    const errorData: { error: string } = await response.json();
    throw new Error(`Erro ${response.status}: ${errorData.error || 'Falha ao buscar dados do aluno'}`);
  }

  const alunoData: Student = await response.json();
  return alunoData;
}

export async function updateAlunoData(formData: Partial<Student>): Promise<boolean> {
  const url = `${apiUrl}/aluno`
  const token = localStorage.getItem("token")

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  })

  if (!response.ok) {
    const errorData: { error?: string } = await response.json().catch(() => ({}))
    console.error(`Erro ${response.status}: ${errorData.error || "Falha ao atualizar dados do aluno"}`)
    return false
  }

  console.log("Aluno atualizado com sucesso.")
  return true
}

export async function deleteAluno(): Promise<boolean> {
  const url = `${apiUrl}/aluno`
  const token = localStorage.getItem("token")

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorData: { error?: string } = await response.json().catch(() => ({}))
    console.error(`Erro ${response.status}: ${errorData.error || "Falha ao excluir conta do aluno"}`)
    return false
  }

  console.log("Conta de aluno excluída com sucesso.")
  return true
}