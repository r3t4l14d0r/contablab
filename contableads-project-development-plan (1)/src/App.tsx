import { useState } from 'react';
import { CRMProvider } from './context/CRMContext';
import { ViewMode } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { KanbanBoard } from './components/KanbanBoard';
import { LeadCaptureSimulator } from './components/LeadCaptureSimulator';
import { TechLeadGuide } from './components/TechLeadGuide';
import { Building, Award, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <CRMProvider>
      <div className="min-h-screen flex bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
        
        {/* Fixed Left Sidebar */}
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Right Content Area */}
        <div 
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          
          {/* Top Bar Navigation */}
          <Header currentView={currentView} setMobileOpen={setMobileOpen} />

          {/* Main Workspace */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'kanban' && <KanbanBoard />}
            {currentView === 'capture' && <LeadCaptureSimulator />}
            {currentView === 'tech_lead_guide' && <TechLeadGuide />}
          </main>

          {/* Corporate Footer */}
          <footer className="bg-white border-t border-slate-200 mt-auto shrink-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                
                <div className="flex items-center space-x-2 text-center md:text-left">
                  <Building className="w-4 h-4 text-blue-600 shrink-0" />
                  <span><strong>ContabLeads</strong> — Mini-CRM & Marketing para Escritórios de Contabilidade</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 text-center">
                  <span className="inline-flex items-center text-slate-600 font-medium">
                    <Award className="w-3.5 h-3.5 text-emerald-500 mr-1" /> Grupo DPG Target
                  </span>
                  <span className="text-slate-300 hidden sm:inline">|</span>
                  <span className="hidden sm:inline">Next.js + Prisma + Tailwind</span>
                </div>

                <div>
                  <button
                    onClick={() => setCurrentView('tech_lead_guide')}
                    className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center transition-colors"
                  >
                    <span>Comandos e Setup (Passo 1)</span>
                    <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </button>
                </div>

              </div>
            </div>
          </footer>

        </div>

      </div>
    </CRMProvider>
  );
}
