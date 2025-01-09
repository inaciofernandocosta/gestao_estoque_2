import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import ResponsiveLayout from '../../nexacapital-responsive-layout';
import EstoqueTable from '../../components/tables/EstoqueTable';
import { getEstoqueSummary } from '../../services/estoqueService';

const EstoquePage: NextPage = () => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getEstoqueSummary();
        setData(result);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Head>
        <title>Gestão de Estoque - Visão por Negócio</title>
        <meta name="description" content="Visão de estoque por negócio" />
      </Head>

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Visão por Negócio</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <EstoqueTable data={data} />
          </div>
        )}
      </div>
    </div>
  );
};

EstoquePage.getLayout = function getLayout(page: React.ReactElement) {
  return <ResponsiveLayout>{page}</ResponsiveLayout>;
};

export default EstoquePage;
