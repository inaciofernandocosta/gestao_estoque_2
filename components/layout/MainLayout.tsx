import React, { useState, useEffect } from 'react';
import {
  Menu, X, ChevronDown, ChevronRight, BarChart3,
  Boxes, TrendingUp, Wallet, Clock, Building2
} from 'lucide-react';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  subItems?: MenuItem[];
  description?: string;
}

const menuItems: MenuItem[] = [
  { 
    id: 'dashboard',
    label: 'Dashboard',
    icon: <BarChart3 size={20} />,
    href: '/',
    description: 'Visão Geral'
  },
  { 
    id: 'estoque',
    label: 'Estoque',
    icon: <Boxes size={20} />,
    href: '/estoque',
    description: 'Gestão de Produtos'
  }
];

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 p-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-500 hover:text-gray-600"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-40
          ${isMobile ? (mobileMenuOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-800">NexaCapital</h1>
        </div>

        {/* Menu Items */}
        <nav className="px-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.href && router.push(item.href)}
              className={`
                w-full flex items-center px-4 py-2 my-1 rounded-lg
                ${router.pathname === item.href ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}
                transition-colors duration-150 ease-in-out
              `}
            >
              {item.icon && <span className="mr-3">{item.icon}</span>}
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`${isMobile ? 'ml-0' : 'ml-64'} min-h-screen transition-all duration-200 ease-in-out`}>
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
