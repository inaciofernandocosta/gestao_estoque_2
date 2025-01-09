import React, { useState, useEffect, ReactNode } from 'react';
import {
  Menu, X, ChevronDown, BarChart3, Users, ShoppingCart, 
  Boxes, LineChart, Settings, Search, TrendingUp, DollarSign,
  Wallet, Clock, Database, HelpCircle
} from 'lucide-react';

interface ResponsiveLayoutProps {
  children: ReactNode;
}

const ResponsiveLayout = ({ children }: ResponsiveLayoutProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor viewport width
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { 
      icon: BarChart3, 
      name: 'Dashboard',
      description: 'Visão Geral'
    },
    { 
      icon: Wallet, 
      name: 'Capital de Giro',
      description: 'Análise Financeira'
    },
    { 
      icon: Database, 
      name: 'Estoque',
      description: 'Gestão de Produtos'
    },
    { 
      icon: TrendingUp, 
      name: 'Performance',
      description: 'Análise de Resultados'
    },
    { 
      icon: Clock, 
      name: 'Histórico',
      description: 'Dados Consolidados'
    }
  ];

  const StatusBar = () => (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <div className="flex items-center space-x-2">
        <span className="text-gray-500">Capital:</span>
        <span className="font-semibold">R$ 40.5M</span>
        <span className="text-xs text-green-600">↑2.5%</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-gray-500">Estoque:</span>
        <span className="font-semibold">R$ 220M</span>
        <span className="text-xs text-red-600">↓1.2%</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-gray-500">Atual:</span>
        <span className="font-semibold">08:00</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Header - Always visible */}
      <header className="bg-white shadow-sm h-14 fixed w-full z-30 flex items-center">
        <div className="w-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => isMobile ? setMobileMenuOpen(!mobileMenuOpen) : setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-indigo-600 font-bold text-xl">Nexa</span>
              <span className="text-gray-700 font-medium text-xl">Capital</span>
            </div>
          </div>

          {/* Status Bar - Hidden on mobile */}
          <div className="hidden md:block">
            <StatusBar />
          </div>

          {/* Search and User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <Search size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Buscar..."
                className="bg-transparent border-none focus:outline-none text-sm w-40"
              />
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <HelpCircle size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar - Hidden on mobile */}
      <aside
        className={`fixed top-14 left-0 h-[calc(100vh-3.5rem)] bg-white border-r border-gray-200 transition-all duration-300 z-20
          ${isMobile ? (mobileMenuOpen ? 'translate-x-0' : '-translate-x-full') : (sidebarOpen ? 'w-64' : 'w-16')}
        `}
      >
        <nav className="h-full py-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors
                    ${!sidebarOpen && !isMobile ? 'justify-center' : ''}
                  `}
                >
                  <item.icon size={20} />
                  {(sidebarOpen || isMobile) && (
                    <div className="flex-1 text-left">
                      <span className="block font-medium">{item.name}</span>
                      <span className="text-xs text-gray-500">{item.description}</span>
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`pt-14 ${sidebarOpen ? 'md:pl-64' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default ResponsiveLayout;
