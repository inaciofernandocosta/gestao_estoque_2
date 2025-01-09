export async function fetchStockData(): Promise<{ stockValue: number; pendingOrders: number }> {
  try {
    const response = await fetch('/api/stock-value');
    const data = await response.json();
    return {
      stockValue: data.total || 0,
      pendingOrders: data.pendingOrders || 0
    };
  } catch (error) {
    console.error('Erro ao buscar dados do estoque:', error);
    return {
      stockValue: 0,
      pendingOrders: 0
    };
  }
}

export async function fetchTotalItems(): Promise<number> {
  try {
    const response = await fetch('/api/stock-items');
    const data = await response.json();
    return data.total || 0;
  } catch (error) {
    console.error('Erro ao buscar total de itens:', error);
    return 0;
  }
}

export async function calculateTotalStockValue(): Promise<number> {
  const { stockValue } = await fetchStockData();
  return stockValue;
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};
