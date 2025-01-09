// Script para analisar o arquivo 'estoque atual.csv'
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const filePath = path.join(__dirname, '../bd/estoque atual.csv');

const metrics = {
  totalCost: 0,
  totalProducts: 0
};

console.log('Iniciando análise do Valor Custo Líquido...');
console.log('Arquivo sendo processado:', filePath);

fs.createReadStream(filePath)
  .pipe(csv({ separator: ',' }))
  .on('data', (row) => {
    metrics.totalProducts += 1;
    // Processa o Valor Custo Líquido
    const custoLiquido = parseFloat(String(row['Valor Custo Líquido'] || '0').replace('.', '').replace(',', '.')) || 0;
    metrics.totalCost += custoLiquido;

    // Debug: mostra os primeiros 5 registros para verificar o processamento
    if (metrics.totalProducts <= 5) {
      console.log(`\nRegistro #${metrics.totalProducts}:`);
      console.log('Valor Custo Líquido (original):', row['Valor Custo Líquido']);
      console.log('Valor Custo Líquido (processado):', custoLiquido);
    }
  })
  .on('end', () => {
    console.log('\n=== Análise de Custo Líquido ===\n');
    console.log(`Total de Produtos: ${metrics.totalProducts}`);
    console.log(`Custo Total Líquido: R$ ${metrics.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    
    // Salvar resultados em JSON
    const outputPath = path.join(__dirname, '../bd/analise_custo.json');
    fs.writeFileSync(outputPath, JSON.stringify(metrics, null, 2));
    console.log('\nResultados salvos em:', outputPath);
  })
  .on('error', (err) => {
    console.error('Erro ao processar arquivo:', err);
  });
