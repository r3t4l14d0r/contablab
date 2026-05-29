import React from 'react';
import { ViewMode } from '../types';
import { useCRM } from '../context/CRMContext';
import { 
  Menu, 
  Users, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  setMobileOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setMobileOpen }) => {
  const { simulateVisitors, resetData } = useCRM();

  const viewTitles: Record<ViewMode, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Dashboard de Marketing',
      subtitle: 'Visão geral de aquisição e conversão de clientes'
    },
    kanban: {
      title: 'CRM Kanban',
      subtitle: 'Gestão comercial e pipeline de oportunidades'
    },
    capture: {
      title: 'Simulador de Rota de API',
      subtitle: 'Demonstração de integração com landing pages e site próprio'
    },
    tech_lead_guide: {
      title: 'Guia do Tech Lead (CLI & Setup)',
      subtitle: 'Comandos do Next.js, Prisma ORM e modelagem relacional'
    }
  };

  const current = viewTitles[currentView] || { title: 'ContabLeads', subtitle: 'Mini-CRM Corporativo' };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 h-16 shrink-0 shadow-xs">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Mobile Menu Button & Breadcrumb */}
        <div className="flex items-center space-x-3">
          
          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Abrir menu de navegação"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb / Page Title */}
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                {current.title}
              </h1>
              
              {currentView === 'dashboard' && (
                <span className="hidden sm:inline-flex items-center text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded">
                  <Sparkles className="w-2.5 h-2.5 mr-1" /> DPG Target
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 hidden sm:block mt-0.5">
              {current.subtitle}
            </p>
          </div>

        </div>

        {/* Right Side: Quick Controls */}
        <div className="flex items-center space-x-2">
          
          <button
            onClick={simulateVisitors}
            title="Simular a chegada de visitantes no site do contador"
            className="bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 border border-slate-200 transition-all shadow-2xs"
          >
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden md:inline">+ Simular Visitantes</span>
            <span className="md:hidden">+ Visitas</span>
          </button>

          <button
            onClick={resetData}
            title="Restaurar estado inicial do portfólio"
            className="bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 border border-slate-200 transition-all shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Resetar Dados</span>
            <span className="md:hidden">Reset</span>
          </button>

        </div>

      </div>
    </header>
  );
};
