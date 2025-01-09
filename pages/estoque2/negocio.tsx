import React from 'react';
import type { NextPage } from 'next';
import ResponsiveLayout from '../../nexacapital-responsive-layout';

const NegocioPage: NextPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Negócio</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Conteúdo da página de Negócio</p>
      </div>
    </div>
  );
};

NegocioPage.getLayout = function getLayout(page: React.ReactElement) {
  return <ResponsiveLayout>{page}</ResponsiveLayout>;
};

export default NegocioPage;
