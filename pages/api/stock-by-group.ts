import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

interface GroupData {
  name: string;
  companies: number[];
  totalStock: number;
  totalPendingOrders: number;
}

const GROUPS: GroupData[] = [
  {
    name: 'Atacado',
    companies: [1, 11, 12, 14],
    totalStock: 0,
    totalPendingOrders: 0
  },
  {
    name: 'Focomix',
    companies: [501, 502],
    totalStock: 0,
    totalPendingOrders: 0
  },
  {
    name: 'V2 Farma',
    companies: [804],
    totalStock: 0,
    totalPendingOrders: 0
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const filePath = path.join(process.cwd(), 'bd', 'processed', 'estoque_atual_tratado.xlsx');
    
    if (!fs.existsSync(filePath)) {
      console.error('Arquivo não encontrado:', filePath);
      return res.status(404).json({ message: 'Arquivo não encontrado' });
    }

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Resetar totais
    GROUPS.forEach(group => {
      group.totalStock = 0;
      group.totalPendingOrders = 0;
    });

    // Processar cada linha
    data.forEach((row: any) => {
      // Usar Código Ei em vez de Empresa
      const empresa = parseInt(row['Código Ei']?.toString() || '0');
      const valorCusto = parseFloat(row['Valor Custo Líquido']?.toString().replace(/[^\d,-]/g, '').replace(',', '.') || '0');
      const pendingOrders = parseFloat(row['Qtd. Pend. Ped.Compra']?.toString().replace(',', '.') || '0');

      // Encontrar grupo da empresa
      const group = GROUPS.find(g => g.companies.includes(empresa));
      if (group) {
        if (!isNaN(valorCusto)) {
          group.totalStock += valorCusto;
        }
        if (!isNaN(pendingOrders)) {
          group.totalPendingOrders += pendingOrders;
        }
      }
    });

    // Log para debug
    console.log('Dados processados:');
    console.log('Nomes das colunas:', Object.keys(data[0] || {}));
    GROUPS.forEach(group => {
      console.log(`${group.name}:`, {
        empresas: group.companies,
        estoque: group.totalStock,
        pendentes: group.totalPendingOrders
      });
    });

    // Calcular totais gerais
    const totals = {
      totalStock: GROUPS.reduce((sum, group) => sum + group.totalStock, 0),
      totalPendingOrders: GROUPS.reduce((sum, group) => sum + group.totalPendingOrders, 0)
    };

    return res.status(200).json({
      groups: GROUPS,
      totals
    });
  } catch (error) {
    console.error('Erro ao calcular valores por grupo:', error);
    return res.status(500).json({ message: 'Erro ao calcular valores por grupo' });
  }
}
