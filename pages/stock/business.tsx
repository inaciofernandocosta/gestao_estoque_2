import React from 'react';
import ResponsiveLayout from '../../nexacapital-responsive-layout';

const BusinessPage = () => {
  return (
    <ResponsiveLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Business</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Business page content</p>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default BusinessPage;
