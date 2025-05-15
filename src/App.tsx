import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ParcelSearchPage from './pages/ParcelSearchPage';
import ParcelDetailPage from './pages/ParcelDetailPage';
import AnalysisPage from './pages/AnalysisPage';
import InsightsPage from './pages/InsightsPage';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/parcels" element={<ParcelSearchPage />} />
          <Route path="/parcel/:id" element={<ParcelDetailPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/insights" element={<InsightsPage />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;