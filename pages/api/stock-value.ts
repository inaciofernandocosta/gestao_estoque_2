import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

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

        const fileContent = xlsx.readFile(filePath);
        const sheetName = fileContent.SheetNames[0];
        const sheet = fileContent.Sheets[sheetName];

        console.log('Arquivo lido com sucesso');
        
        const lines = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        console.log('Número de linhas:', lines.length);
        console.log('Primeira linha:', lines[0]);

        const headers = lines[0];
        console.log('Headers encontrados:', headers);

        // Procura pela coluna de valor
        const valorCustoIndex = headers.findIndex(h => 
            h.includes('Valor Custo Líquido') || 
            h.includes('Valor Custo') || 
            h.includes('Custo Líquido') ||
            h.includes('Valor')
        );

        // Procura pela coluna de pedidos pendentes
        const pendingOrdersIndex = headers.findIndex(h => 
            h.includes('Qtd. Pend. Ped.Compra')
        );

        console.log('Índice da coluna de valor:', valorCustoIndex);
        console.log('Índice da coluna de pedidos pendentes:', pendingOrdersIndex);
        
        if (valorCustoIndex === -1) {
            console.error('Coluna de valor não encontrada. Headers disponíveis:', headers);
            return res.status(500).json({ message: 'Coluna de valor não encontrada' });
        }

        let total = 0;
        let totalPendingOrders = 0;
        let processedLines = 0;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (!line) continue;

            // Processa valor do estoque
            if (line.length > valorCustoIndex) {
                const value = line[valorCustoIndex];
                if (value) {
                    const cleanValue = value.toString().replace(/[^0-9,.-]/g, '').replace(',', '.');
                    const numericValue = parseFloat(cleanValue);
                    if (!isNaN(numericValue)) {
                        total += numericValue;
                        processedLines++;
                    }
                }
            }

            // Processa pedidos pendentes
            if (pendingOrdersIndex !== -1 && line.length > pendingOrdersIndex) {
                const value = line[pendingOrdersIndex];
                if (value !== undefined && value !== null && value !== '') {
                    const numericValue = parseFloat(value.toString().replace(',', '.'));
                    if (!isNaN(numericValue)) {
                        totalPendingOrders += numericValue;
                    }
                }
            }
        }

        console.log('Linhas processadas:', processedLines);
        console.log('Total calculado:', total);
        console.log('Total de pedidos pendentes:', totalPendingOrders);
        
        return res.status(200).json({ 
            total,
            pendingOrders: totalPendingOrders
        });
    } catch (error) {
        console.error('Erro ao calcular valores:', error);
        return res.status(500).json({ message: 'Erro ao calcular valores' });
    }
}
