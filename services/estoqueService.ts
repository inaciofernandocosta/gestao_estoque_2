import fs from 'fs';
import path from 'path';

export interface EstoqueItem {
  produto: string;
  nomeProduto: string;
  comprador: string;
  quantidadeEmEstoque: number;
  quantidadeReservada: number;
  quantidadeDisponivel: number;
  valorPrecoDeVenda: number;
}

export interface EstoqueSummary {
  comprador: string;
  negocio: string;
  estoqueAtual: number;
  pendente: number;
  totalPrevisto: number;
}

export const getEstoqueSummary = async (): Promise<EstoqueSummary[]> => {
  const summaryMap = new Map<string, EstoqueSummary>();

  try {
    const response = await fetch('/data/mock-data.json');
    const data = await response.json();

    Object.entries(data).forEach(([negocio, items]: [string, any]) => {
      items.forEach((item: EstoqueItem) => {
        const key = `${item.comprador}-${negocio}`;
        
        if (!summaryMap.has(key)) {
          summaryMap.set(key, {
            comprador: item.comprador,
            negocio: negocio.toUpperCase(),
            estoqueAtual: 0,
            pendente: 0,
            totalPrevisto: 0
          });
        }

        const summary = summaryMap.get(key)!;
        summary.estoqueAtual += item.valorPrecoDeVenda * item.quantidadeEmEstoque;
        summary.pendente += item.valorPrecoDeVenda * item.quantidadeReservada;
        summary.totalPrevisto = summary.estoqueAtual + summary.pendente;
      });
    });
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }

  return Array.from(summaryMap.values());
};
