import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';

const EstoquePage: NextPage = () => {
  const mockData = [
    {
      negocio: 'SP',
      comprador: 'João Silva',
      estoqueAtual: 1234567.89,
      pendente: 234567.89,
      totalPrevisto: 1469135.78
    },
    {
      negocio: 'HB',
      comprador: 'Maria Santos',
      estoqueAtual: 987654.32,
      pendente: 123456.78,
      totalPrevisto: 1111111.10
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Gestão de Estoque - Visão por Negócio</title>
        <meta name="description" content="Visão de estoque por negócio" />
      </Head>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Visão por Negócio</h1>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Negócio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comprador
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque Atual
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pendente
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Previsto
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockData.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.negocio}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.comprador}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {`R$ ${item.estoqueAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {`R$ ${item.pendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {`R$ ${item.totalPrevisto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default EstoquePage;
