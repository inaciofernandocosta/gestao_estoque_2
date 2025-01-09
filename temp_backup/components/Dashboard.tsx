import React from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const Dashboard = () => {
  // Dados mockados para exemplo
  const metricas = {
    estoqueAtual: 233000000,
    capitalGiro: 40500000,
    produtosSemGiro: 145,
    categorias: [
      { nome: 'Alimentos', valor: 85000000, variacao: 2.5 },
      { nome: 'Limpeza', valor: 45000000, variacao: -1.2 },
      { nome: 'Bebidas', valor: 38000000, variacao: 1.8 },
      { nome: 'Perfumaria', valor: 25000000, variacao: 3.2 },
      { nome: 'Higiene Pessoal', valor: 30000000, variacao: -0.5 },
      { nome: 'Bazar', valor: 10000000, variacao: 1.1 },
    ],
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(valor);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="text-blue-600" size={24} />
            </div>
            <span className="text-sm font-medium text-gray-500">Estoque Atual</span>
          </div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold">{formatarMoeda(metricas.estoqueAtual)}</h2>
            <span className="text-green-600 flex items-center text-sm">
              <ArrowUpRight size={16} className="mr-1" />
              2.5%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <span className="text-sm font-medium text-gray-500">Capital de Giro</span>
          </div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold">{formatarMoeda(metricas.capitalGiro)}</h2>
            <span className="text-red-600 flex items-center text-sm">
              <ArrowDownRight size={16} className="mr-1" />
              1.2%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertTriangle className="text-orange-600" size={24} />
            </div>
            <span className="text-sm font-medium text-gray-500">Produtos Sem Giro</span>
          </div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold">{metricas.produtosSemGiro}</h2>
            <span className="text-orange-600 text-sm">5+ dias</span>
          </div>
        </div>
      </div>

      {/* Tabela de categorias */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Distribuição por Categoria</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Categoria</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Valor</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Variação</th>
              </tr>
            </thead>
            <tbody>
              {metricas.categorias.map((categoria, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm">{categoria.nome}</td>
                  <td className="text-right py-3 px-4 text-sm font-medium">
                    {formatarMoeda(categoria.valor)}
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className={`text-sm ${categoria.variacao >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {categoria.variacao >= 0 ? '+' : ''}{categoria.variacao}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
