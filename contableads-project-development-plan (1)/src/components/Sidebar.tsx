import React from 'react';
import { ViewMode } from '../types';
import { 
  LayoutDashboard, 
  KanbanSquare, 
  Radio, 
  Terminal, 
  Sparkles, 
  ChevronLeft,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen
}) => {

  const navigationItems = [
    {
      id: 'dashboard' as ViewMode,
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Métricas e performance'
    },
    {
      id: 'kanban' as ViewMode,
      label: 'CRM Kanban',
      icon: KanbanSquare,
      description: 'Gestão visual de leads'
    },
    {
      id: 'capture' as ViewMode,
      label: 'Simular API',
      icon: Radio,
      description: 'Captura pública de leads',
      isPulse: true
    },
    {
      id: 'tech_lead_guide' as ViewMode,
      label: 'Guia Tech Lead',
      icon: Terminal,
      description: 'Setup, CLI e Modelagem'
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-slate-900 text-white border-r border-slate-800 transition-all duration-300 flex flex-col ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        
        {/* Brand / Logo Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="bg-gradient-to-tr from-blue-600 to-emerald-500 p-2 rounded-lg shadow-inner shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 animate-in fade-in duration-200">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-base tracking-tight truncate">
                    Contab<span className="text-emerald-400">Leads</span>
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 truncate">Portfólio Grupo DPG</span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isCollapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5">
          
          {!isCollapsed && (
            <div className="px-3 mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Navegação Principal
            </div>
          )}

          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setMobileOpen(false);
                }}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/20 to-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="relative shrink-0">
                  <IconComponent className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'}`} />
                  {item.isPulse && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </div>

                {!isCollapsed && (
                  <div className="flex flex-col text-left truncate">
                    <span className="truncate leading-tight">{item.label}</span>
                    <span className="text-[10px] text-slate-500 font-normal truncate mt-0.5">{item.description}</span>
                  </div>
                )}

                {/* Active indicator bar */}
                {isActive && isCollapsed && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald-400 rounded-r" />
                )}
              </button>
            );
          })}

        </div>

        {/* Sidebar Footer info */}
        <div className="p-3 border-t border-slate-800 shrink-0">
          {!isCollapsed ? (
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-1 animate-in fade-in duration-200">
              <div className="flex items-center space-x-1.5 text-slate-300 font-medium">
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>Modo de Apresentação</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Os leads simulados refletem o nicho contábil visado pelo Grupo DPG.
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Sistema Online" />
            </div>
          )}
        </div>

      </aside>
    </>
  );
};
