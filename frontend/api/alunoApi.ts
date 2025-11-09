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

export async function getExtrato() {
  const url = `${apiUrl}/aluno/extrato`;

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
    throw new Error(`Erro ${response.status}: ${errorData.error || 'Falha ao buscar extrato do aluno'}`);
  }

  const extratoData = await response.json();
  return extratoData;
}

export async function updateAluno(updatedAluno: Student): Promise<Student> {
  const url = `${apiUrl}/aluno`;

  const token = localStorage.getItem('token');

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updatedAluno),
  });

  if (!response.ok) {
    const errorData: { error: string } = await response.json();
    throw new Error(`Erro ${response.status}: ${errorData.error || 'Falha ao buscar dados do aluno'}`);
  }

  const alunoData: Student = await response.json();
  return alunoData;
}

export async function resgatarVantagem(advantageId: string): Promise<Student> {
  const url = `${apiUrl}/aluno/resgatar-vantagem`;
  const token = localStorage.getItem('token');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ vantagem_id: Number(advantageId) }), 
  });

  if (!response.ok) {
    const errorData: { error: string } = await response.json();
    
    // O backend provavelmente retornará 409 (Conflict) ou 400 se o saldo for insuficiente
    // Estamos tratando "saldo insuficiente" vindo do backend
    if (response.status === 409 || response.status === 400) {
       throw new Error(errorData.error || 'Saldo insuficiente');
    }

    throw new Error(`Erro ${response.status}: ${errorData.error || 'Falha ao resgatar vantagem'}`);
  }

  // O backend deve retornar o objeto Aluno atualizado com o novo saldo
  const alunoData: Student = await response.json();
  return alunoData;
}



export async function updateAlunoSaldo(valor: number): Promise<Student> {
  const url = `${apiUrl}/aluno/saldo`; // Endpoint PATCH
  const token = localStorage.getItem('token');

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ valor: valor }), 
  });

  if (!response.ok) {
    const errorData: { error: string } = await response.json();
    
    if (response.status === 409) { 
       throw new Error(errorData.error || 'Saldo insuficiente');
    }

    throw new Error(`Erro ${response.status}: ${errorData.error || 'Falha ao atualizar saldo'}`);
  }

  const alunoData: Student = await response.json();
  return alunoData;
}