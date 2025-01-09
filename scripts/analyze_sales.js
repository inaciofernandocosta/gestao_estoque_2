// Script para analisar faturamento e custos
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const filePath = path.join(__dirname, '../bd/vendas.xlsx');

const metrics = {
  totalRevenue: 0,
  totalCost: 0,
  totalProfit: 0,
  totalSales: 0,
  monthlyRevenue: {},
  monthlyCost: {},
  monthlyProfit: {}
};

console.log('Iniciando análise de vendas e custos...');
console.log('Arquivo sendo processado:', filePath);

try {
  // Lê o arquivo Excel
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Converte para JSON
  const rows = XLSX.utils.sheet_to_json(worksheet);

  // Processa cada linha
  rows.forEach(row => {
    // Incrementa contador de vendas
    metrics.totalSales++;

    // Extrai data da venda (assumindo que existe uma coluna 'Data')
    const date = new Date(row['Data']);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

    // Processa valores (assumindo que existem colunas 'Valor Total' e 'Custo Total')
    const revenue = parseFloat(String(row['Valor Total']).replace('.', '').replace(',', '.')) || 0;
    const cost = parseFloat(String(row['Custo Total']).replace('.', '').replace(',', '.')) || 0;
    const profit = revenue - cost;

    // Atualiza totais
    metrics.totalRevenue += revenue;
    metrics.totalCost += cost;
    metrics.totalProfit += profit;

    // Atualiza métricas mensais
    if (!metrics.monthlyRevenue[monthKey]) {
      metrics.monthlyRevenue[monthKey] = 0;
      metrics.monthlyCost[monthKey] = 0;
      metrics.monthlyProfit[monthKey] = 0;
    }
    metrics.monthlyRevenue[monthKey] += revenue;
    metrics.monthlyCost[monthKey] += cost;
    metrics.monthlyProfit[monthKey] += profit;
  });

  // Exibe resultados
  console.log('\n=== Análise de Faturamento e Custos ===\n');
  console.log(`Total de Vendas: ${metrics.totalSales}`);
  console.log(`Faturamento Total: R$ ${metrics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  console.log(`Custo Total: R$ ${metrics.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  console.log(`Lucro Total: R$ ${metrics.totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  
  const marginPercent = (metrics.totalProfit / metrics.totalRevenue) * 100;
  console.log(`Margem de Lucro: ${marginPercent.toFixed(2)}%`);

  console.log('\n=== Análise Mensal ===\n');
  Object.keys(metrics.monthlyRevenue).sort().forEach(month => {
    console.log(`\nMês: ${month}`);
    console.log(`Faturamento: R$ ${metrics.monthlyRevenue[month].toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    console.log(`Custo: R$ ${metrics.monthlyCost[month].toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    console.log(`Lucro: R$ ${metrics.monthlyProfit[month].toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    const monthlyMargin = (metrics.monthlyProfit[month] / metrics.monthlyRevenue[month]) * 100;
    console.log(`Margem: ${monthlyMargin.toFixed(2)}%`);
  });

  // Salva resultados em JSON
  const outputPath = path.join(__dirname, '../bd/analise_vendas.json');
  fs.writeFileSync(outputPath, JSON.stringify(metrics, null, 2));
  console.log('\nResultados salvos em:', outputPath);

} catch (err) {
  console.error('Erro ao processar arquivo:', err);
}
