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
    id: 'capital',
    label: 'Capital de Giro',
    icon: <Wallet size={20} />,
    href: '/capital',
    description: 'Análise Financeira'
  },
  { 
    id: 'estoque',
    label: 'Estoque',
    icon: <Boxes size={20} />,
    description: 'Gestão de Produtos',
    subItems: [
      {
        id: 'negocios',
        label: 'Negócios',
        icon: <TrendingUp size={20} />,
        href: '/estoque'
      },
      {
        id: 'bu',
        label: 'BU',
        icon: <Building2 size={20} />,
        href: '/estoque/bu'
      }
    ]
  },
  { 
    id: 'performance',
    label: 'Performance',
    icon: <TrendingUp size={20} />,
    href: '/performance',
    description: 'Análise de Resultados'
  },
  { 
    id: 'historico',
    label: 'Histórico',
    icon: <Clock size={20} />,
    href: '/historico',
    description: 'Dados Consolidados'
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
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = (id: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderMenuItem = (item: MenuItem) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isOpen = openMenus[item.id];
    const isActive = router.pathname === item.href || 
      (item.subItems?.some(subItem => router.pathname === subItem.href));

    return (
      <div key={item.id} className="w-full">
        <button
          onClick={() => {
            if (hasSubItems) {
              toggleMenu(item.id);
            } else if (item.href) {
              router.push(item.href);
            }
          }}
          className={`
            w-full flex items-center px-4 py-2 my-1 rounded-lg
            ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}
            transition-colors duration-150 ease-in-out
          `}
        >
          {item.icon && <span className="mr-3">{item.icon}</span>}
          <span className="flex-1 text-left">{item.label}</span>
          {hasSubItems && (
            <span className="ml-auto">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </button>
        
        {hasSubItems && isOpen && (
          <div className="ml-4 pl-4 mt-1 border-l border-gray-200">
            {item.subItems.map(subItem => (
              <button
                key={subItem.id}
                onClick={() => subItem.href && router.push(subItem.href)}
                className={`
                  w-full flex items-center px-4 py-2 text-sm rounded-lg
                  ${router.pathname === subItem.href ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}
                  transition-colors duration-150 ease-in-out
                `}
              >
                {subItem.icon && <span className="mr-3">{subItem.icon}</span>}
                <span>{subItem.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm h-14 fixed w-full z-30">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => isMobile ? setMobileMenuOpen(!mobileMenuOpen) : setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <span className="text-xl font-semibold text-indigo-600">Nexa</span>
              <span className="text-xl font-medium text-gray-700">Capital</span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64
          bg-white shadow-lg transform transition-transform duration-200 ease-in-out
          ${sidebarOpen || mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          z-30
        `}
      >
        <nav className="h-full overflow-y-auto py-4 px-2">
          {menuItems.map(renderMenuItem)}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`
          pt-14 min-h-screen transition-all duration-200
          ${sidebarOpen ? 'md:pl-64' : ''}
        `}
      >
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
