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

        // Procura pela coluna de código com diferentes possíveis nomes
        const codigoProdutoIndex = headers.findIndex(h => 
            h.includes('Código Pr-Y') || 
            h.includes('Código') || 
            h.includes('Cod') ||
            h.includes('SKU')
        );

        console.log('Índice da coluna de código:', codigoProdutoIndex);
        
        if (codigoProdutoIndex === -1) {
            console.error('Coluna de código não encontrada. Headers disponíveis:', headers);
            return res.status(500).json({ message: 'Coluna de código não encontrada' });
        }

        // Usar Set para garantir que cada código seja contado apenas uma vez
        const uniqueProducts = new Set<string>();
        let processedLines = 0;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (!line) continue;

            if (line.length > codigoProdutoIndex) {
                const code = line[codigoProdutoIndex];
                if (code) {
                    uniqueProducts.add(code.toString());
                    processedLines++;
                }
            }
        }

        const totalUniqueItems = uniqueProducts.size;
        console.log('Linhas processadas:', processedLines);
        console.log('Total de itens únicos:', totalUniqueItems);
        
        return res.status(200).json({ total: totalUniqueItems });
    } catch (error) {
        console.error('Erro ao calcular total de itens únicos:', error);
        return res.status(500).json({ message: 'Erro ao calcular total de itens únicos' });
    }
}
