import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Aplica máscara ao CEP (adiciona hífen)
 * Usado para exibir dados vindos do backend
 * @param cep - CEP sem formatação (ex: "12345678")
 * @returns CEP formatado (ex: "12345-678") ou string vazia se inválido
 */
export function maskCep(cep: string): string {
  if (!cep) return ""

  const cleanCep = cep.replace(/\D/g, "")

  if (cleanCep.length !== 8) return cep

  return cleanCep.replace(/^(\d{5})(\d{3})$/, "$1-$2")
}

/**
 * Remove máscara do CEP (remove hífen)
 * Usado para enviar dados para o backend
 * @param cep - CEP formatado (ex: "12345-678")
 * @returns CEP sem formatação (ex: "12345678") ou string vazia se inválido
 */
export function unmaskCep(cep: string): string {
  if (!cep) return ""

  const cleanCep = cep.replace(/\D/g, "")

  if (cleanCep.length !== 8) return ""

  return cleanCep
}

/**
 * Valida se o CEP está no formato correto
 * @param cep - CEP para validar
 * @returns true se válido, false caso contrário
 */
export function isValidCep(cep: string): boolean {
  if (!cep) return false

  const cleanCep = cep.replace(/\D/g, "")
  return cleanCep.length === 8
}

/**
 * Formata CEP enquanto o usuário digita
 * Usado em inputs para aplicar máscara em tempo real
 * @param value - Valor atual do input
 * @returns Valor formatado com máscara aplicada
 */

export function formatCepInput(value: string): string {
  if (!value) return ""

  const cleanValue = value.replace(/\D/g, "")

  const limitedValue = cleanValue.slice(0, 8)

  if (limitedValue.length <= 5) {
    return limitedValue
  } else {
    return limitedValue.replace(/^(\d{5})(\d{0,3})$/, "$1-$2")
  }
}

