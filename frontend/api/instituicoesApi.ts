import { Institution } from "@/types";
import apiUrl from "./apiUrl";

export const getAllInstituicoes = async () => {
  const url = `${apiUrl}/instituicoes`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
    })

  if (!response.ok) {
    const errorData: { error: string } = await response.json();
    throw new Error(`Erro ${response.status}: ${errorData.error || 'Falha ao buscar instituições'}`);
  }

  const instituicoesData: Institution[] = await response.json();
  return instituicoesData;
}