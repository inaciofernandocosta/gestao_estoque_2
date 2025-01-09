import React from 'react';
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import EstoqueTable from '@/components/tables/EstoqueTable';
import { getEstoqueSummary, type EstoqueSummary } from '@/services/estoqueService';

interface NegociosPageProps {
  estoqueData: EstoqueSummary[];
}

const NegociosPage: NextPage<NegociosPageProps> = ({ estoqueData }) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Negócios</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visão geral do estoque por negócio e comprador
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Estoque por Comprador
          </h2>
        </div>
        <div className="p-6">
          <EstoqueTable data={estoqueData} />
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const estoqueData = await getEstoqueSummary();
  
  return {
    props: {
      estoqueData,
    },
  };
};

export default NegociosPage;
