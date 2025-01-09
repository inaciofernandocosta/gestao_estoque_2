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
  const files = {
    SP: '/data/sp.json',
    HB: '/data/hb.json',
    FOCOMIX: '/data/focomix.json'
  };

  const summaryMap = new Map<string, EstoqueSummary>();

  for (const [negocio, filePath] of Object.entries(files)) {
    try {
      const response = await fetch(filePath);
      const items: EstoqueItem[] = await response.json();

      items.forEach(item => {
        const key = `${item.comprador}-${negocio}`;
        
        if (!summaryMap.has(key)) {
          summaryMap.set(key, {
            comprador: item.comprador,
            negocio,
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
    } catch (error) {
      console.error(`Erro ao carregar dados de ${negocio}:`, error);
    }
  }

  return Array.from(summaryMap.values());
};
