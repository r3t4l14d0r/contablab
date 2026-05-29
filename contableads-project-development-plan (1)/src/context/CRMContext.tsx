import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lead, DashboardMetrics, FunnelStatus, LeadHistoryItem, LeadOrigin } from '../types';
import { INITIAL_LEADS, INITIAL_METRICS } from '../data/mockData';

interface CRMContextType {
  leads: Lead[];
  metrics: DashboardMetrics;
  addLead: (leadData: Omit<Lead, 'id' | 'createdAt' | 'history' | 'status'> & { status?: FunnelStatus }) => void;
  updateLeadStatus: (leadId: string, newStatus: FunnelStatus) => void;
  updateLead: (leadId: string, updatedData: Partial<Lead>) => void;
  addLeadHistory: (leadId: string, type: LeadHistoryItem['type'], description: string) => void;
  resetData: () => void;
  simulateVisitors: () => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('@ContabLeads:leads');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erro ao ler leads do localStorage", e);
      }
    }
    return INITIAL_LEADS;
  });

  const [visitorsCount, setVisitorsCount] = useState<number>(() => {
    const saved = localStorage.getItem('@ContabLeads:visitors');
    return saved ? parseInt(saved, 10) : INITIAL_METRICS.visitors;
  });

  // Salvar no localStorage sempre que os leads mudarem
  useEffect(() => {
    localStorage.setItem('@ContabLeads:leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('@ContabLeads:visitors', visitorsCount.toString());
  }, [visitorsCount]);

  // Função para simular o recebimento de mais visitantes no site do contador
  const simulateVisitors = () => {
    setVisitorsCount(prev => prev + Math.floor(Math.random() * 15) + 5);
  };

  // Cálculos dinâmicos para o Dashboard de Marketing com base nos leads em tempo real
  const metrics: DashboardMetrics = React.useMemo(() => {
    const leadsCount = leads.length;
    // Evitar divisão por zero
    const conversionRate = visitorsCount > 0 ? Number(((leadsCount / visitorsCount) * 100).toFixed(2)) : 0;
    
    const activeProposals = leads.filter(l => l.status === 'PROPOSAL').length;
    
    // Somar o valor estimado de leads que não estão fechados ou de todos
    const estimatedPipeline = leads
      .filter(l => l.status !== 'CLOSED')
      .reduce((sum, l) => sum + (l.estimatedValue || 0), 0);

    // Contagem de leads por origem
    const originCounts: Record<LeadOrigin, number> = {
      'Google Ads DPG': 0,
      'SEO Local': 0,
      'Indicação': 0,
      'Instagram': 0,
      'Site Próprio': 0,
      'Landing Page': 0
    };

    leads.forEach(l => {
      if (originCounts[l.origin] !== undefined) {
        originCounts[l.origin] += 1;
      } else {
        originCounts[l.origin] = 1;
      }
    });

    const originColors: Record<LeadOrigin, string> = {
      'Google Ads DPG': '#2563eb', // blue-600
      'SEO Local': '#10b981', // emerald-500
      'Indicação': '#f59e0b', // amber-500
      'Instagram': '#ec4899', // pink-500
      'Site Próprio': '#6366f1', // indigo-500
      'Landing Page': '#8b5cf6' // violet-500
    };

    const leadsByOrigin = Object.entries(originCounts)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value,
        color: originColors[name as LeadOrigin] || '#64748b'
      }));

    // Para o gráfico mensal, pegamos a base inicial e ajustamos com os leads atuais para demonstrar crescimento
    const baseMonthly = [...INITIAL_METRICS.monthlyLeads];
    // Se o usuário adicionou novos leads, podemos refletir no mês atual (Fev ou Março)
    const currentMonthIndex = baseMonthly.length - 1;
    const initialLeadsCount = INITIAL_LEADS.length;
    if (leadsCount > initialLeadsCount) {
      const diff = leadsCount - initialLeadsCount;
      baseMonthly[currentMonthIndex] = {
        ...baseMonthly[currentMonthIndex],
        leads: baseMonthly[currentMonthIndex].leads + diff
      };
    }

    return {
      visitors: visitorsCount,
      leadsCount,
      conversionRate,
      activeProposals,
      estimatedPipeline,
      monthlyLeads: baseMonthly,
      leadsByOrigin
    };
  }, [leads, visitorsCount]);

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'history' | 'status'> & { status?: FunnelStatus }) => {
    const newId = `lead-${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    const newLead: Lead = {
      ...leadData,
      id: newId,
      status: leadData.status || 'NEW',
      createdAt: timestamp,
      history: [
        {
          id: `h-${Date.now()}`,
          type: 'CREATED',
          description: `Lead recebido via ${leadData.origin} para o serviço de ${leadData.service}`,
          createdAt: timestamp
        }
      ]
    };

    setLeads(prev => [newLead, ...prev]);
  };

  const updateLeadStatus = (leadId: string, newStatus: FunnelStatus) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        if (lead.status === newStatus) return lead; // sem alteração real

        const statusLabels: Record<FunnelStatus, string> = {
          NEW: 'Novos Leads',
          CONTACTED: 'Em Contato',
          PROPOSAL: 'Proposta',
          CLOSED: 'Fechado'
        };

        const newHistoryItem: LeadHistoryItem = {
          id: `h-${Date.now()}`,
          type: 'STATUS_CHANGE',
          description: `Status atualizado para "${statusLabels[newStatus]}"`,
          createdAt: new Date().toISOString()
        };

        return {
          ...lead,
          status: newStatus,
          history: [newHistoryItem, ...lead.history]
        };
      }
      return lead;
    }));
  };

  const updateLead = (leadId: string, updatedData: Partial<Lead>) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        return { ...lead, ...updatedData };
      }
      return lead;
    }));
  };

  const addLeadHistory = (leadId: string, type: LeadHistoryItem['type'], description: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const newHistoryItem: LeadHistoryItem = {
          id: `h-${Date.now()}`,
          type,
          description,
          createdAt: new Date().toISOString()
        };
        return {
          ...lead,
          history: [newHistoryItem, ...lead.history]
        };
      }
      return lead;
    }));
  };

  const resetData = () => {
    setLeads(INITIAL_LEADS);
    setVisitorsCount(INITIAL_METRICS.visitors);
    localStorage.removeItem('@ContabLeads:leads');
    localStorage.removeItem('@ContabLeads:visitors');
  };

  return (
    <CRMContext.Provider value={{
      leads,
      metrics,
      addLead,
      updateLeadStatus,
      updateLead,
      addLeadHistory,
      resetData,
      simulateVisitors
    }}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM deve ser usado dentro de um CRMProvider');
  }
  return context;
};
