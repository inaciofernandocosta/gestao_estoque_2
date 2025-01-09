import React, { useState, useEffect } from 'react';
import {
  Menu, X, ChevronDown, ChevronRight, BarChart3, Users, ShoppingCart, 
  Boxes, LineChart, Settings, Search, TrendingUp, DollarSign,
  Wallet, Clock, Database, HelpCircle, Building2, Factory, Store
} from 'lucide-react';
import { useRouter } from 'next/router';
import Dashboard from './components/Dashboard';
import { calculateTotalStockValue, formatCurrency } from './utils/stockCalculations';

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
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
        href: '/estoque/negocios'
      },
      {
        id: 'bu',
        label: 'BU',
        icon: <Building2 size={20} />,
        subItems: [
          {
            id: 'atacado',
            label: 'Atacado',
            icon: <Building2 size={20} />,
            href: '/estoque/bu/atacado'
          },
          {
            id: 'focomix',
            label: 'Focomix',
            icon: <Factory size={20} />,
            href: '/estoque/bu/focomix'
          },
          {
            id: 'v2farma',
            label: 'V2 Farma',
            icon: <Store size={20} />,
            href: '/estoque/bu/v2farma'
          }
        ]
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

interface LayoutProps {
  children: React.ReactNode;
}

const ResponsiveLayout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [totalStockValue, setTotalStockValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadTotalValue = async () => {
      try {
        setLoading(true);
        const total = await calculateTotalStockValue();
        setTotalStockValue(total);
      } catch (error) {
        console.error('Erro ao carregar valor total:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTotalValue();
  }, []);

  const toggleMenu = (id: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isOpen = openMenus[item.id];

    return (
      <div key={item.id} className="w-full">
        <div
          className={`
            flex items-center w-full px-4 py-2 my-1
            ${level === 0 ? 'text-gray-700' : 'text-gray-600'}
            ${level > 0 ? 'pl-8 text-sm' : ''}
            hover:bg-gray-100 rounded-lg cursor-pointer
          `}
          onClick={() => {
            if (hasSubItems) {
              toggleMenu(item.id);
            } else if (item.href) {
              router.push(item.href);
            }
          }}
        >
          {item.icon && (
            <span className={`${level === 0 ? 'text-gray-700' : 'text-gray-500'} mr-3`}>
              {item.icon}
            </span>
          )}
          <span className="flex-1">{item.label}</span>
          {hasSubItems && (
            <span className="ml-auto text-gray-400">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </div>
        {hasSubItems && isOpen && (
          <div className="mt-1 border-l-2 border-gray-100 ml-6">
            {item.subItems.map(subItem => renderMenuItem(subItem, level + 1))}
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
              className="p-2 rounded-lg hover:bg-gray-100"
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
          {menuItems.map(item => renderMenuItem(item))}
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

export default ResponsiveLayout;