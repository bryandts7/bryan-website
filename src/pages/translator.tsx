import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import BahasaUnangTranslator from '../components/BahasaUnangTranslator';

const TranslatorPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow">
        <BahasaUnangTranslator />
      </main>
      <Footer />
    </div>
  );
};

export default TranslatorPage;