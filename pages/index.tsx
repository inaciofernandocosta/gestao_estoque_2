import type { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/layout/Layout';

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>NexaCapital - Gestão de Estoque</title>
        <meta name="description" content="Sistema de gestão de estoque" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Total em Estoque</h2>
            <p className="text-3xl font-bold text-indigo-600">R$ 1.234.567,89</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Pedidos Pendentes</h2>
            <p className="text-3xl font-bold text-indigo-600">R$ 234.567,89</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Total Previsto</h2>
            <p className="text-3xl font-bold text-indigo-600">R$ 1.469.135,78</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
