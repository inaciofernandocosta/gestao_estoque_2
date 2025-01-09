const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const estoqueDir = path.join(__dirname, '..', 'data', 'estoque');
const outputDir = path.join(__dirname, '..', 'public', 'data');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = {
  sp: 'Estoque atual Produto Comprador SP.xlsx',
  hb: 'Estoque atual Produto Comprador HB.xlsx',
  focomix: 'Estoque atual Produto Comprador FOCOMIX.xlsx'
};

const processExcelFile = (filePath, outputPath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const processedData = data.map(row => ({
      produto: row['Produto'],
      nomeProduto: row['Nome Produto'],
      comprador: row['Comprador'],
      quantidadeEmEstoque: Number(row['Quantidade em Estoque'] || 0),
      quantidadeReservada: Number(row['Quantidade Reservada'] || 0),
      quantidadeDisponivel: Number(row['Quantidade Disponível'] || 0),
      valorPrecoDeVenda: Number(row['Valor Preco de Venda'] || 0),
    }));

    fs.writeFileSync(outputPath, JSON.stringify(processedData, null, 2));
    console.log(`Converted ${filePath} to ${outputPath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
};

// Process each file
Object.entries(files).forEach(([key, filename]) => {
  const inputPath = path.join(estoqueDir, filename);
  const outputPath = path.join(outputDir, `${key}.json`);
  processExcelFile(inputPath, outputPath);
});

console.log('Conversion complete!');
