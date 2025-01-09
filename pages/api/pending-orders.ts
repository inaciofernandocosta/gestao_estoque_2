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

        // Procura pela coluna de pedidos pendentes
        const pendingOrdersIndex = headers.findIndex(h => 
            h.includes('Qtd. Pend. Ped.Compra') || 
            h.includes('Qtd Pendente') ||
            h.includes('Pedidos Pendentes')
        );

        console.log('Índice da coluna de pedidos pendentes:', pendingOrdersIndex);
        
        if (pendingOrdersIndex === -1) {
            console.error('Coluna de pedidos pendentes não encontrada. Headers disponíveis:', headers);
            return res.status(500).json({ message: 'Coluna de pedidos pendentes não encontrada' });
        }

        let total = 0;
        let processedLines = 0;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (!line) continue;

            if (line.length > pendingOrdersIndex) {
                const value = line[pendingOrdersIndex];
                if (value !== undefined && value !== null && value !== '') {
                    // Converte para número e soma apenas se for um número válido
                    const numericValue = parseFloat(value.toString().replace(',', '.'));
                    if (!isNaN(numericValue)) {
                        total += numericValue;
                        processedLines++;
                    }
                }
            }
        }

        console.log('Linhas processadas:', processedLines);
        console.log('Total de pedidos pendentes:', total);
        
        return res.status(200).json({ total });
    } catch (error) {
        console.error('Erro ao calcular total de pedidos pendentes:', error);
        return res.status(500).json({ message: 'Erro ao calcular total de pedidos pendentes' });
    }
}
