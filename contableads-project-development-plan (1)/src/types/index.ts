export type FunnelStatus = 'NEW' | 'CONTACTED' | 'PROPOSAL' | 'CLOSED';

export type LeadOrigin = 
  | 'Google Ads DPG' 
  | 'SEO Local' 
  | 'Instagram' 
  | 'Indicação' 
  | 'Site Próprio'
  | 'Landing Page';

export type ServiceType = 
  | 'Abertura de Empresa' 
  | 'Troca de Contador' 
  | 'BPO Financeiro' 
  | 'Consultoria Tributária' 
  | 'Imposto de Renda' 
  | 'Outros';

export interface LeadHistoryItem {
  id: string;
  type: 'CREATED' | 'STATUS_CHANGE' | 'NOTE_ADDED' | 'PROPOSAL_SENT';
  description: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: FunnelStatus;
  service: ServiceType;
  origin: LeadOrigin;
  estimatedValue?: number;
  notes: string;
  createdAt: string;
  history: LeadHistoryItem[];
}

export interface MonthlyMetric {
  month: string;
  leads: number;
  proposals: number;
  closed: number;
}

export interface OriginMetric {
  name: string;
  value: number;
  color: string;
}

export interface DashboardMetrics {
  visitors: number;
  leadsCount: number;
  conversionRate: number;
  activeProposals: number;
  estimatedPipeline: number;
  monthlyLeads: MonthlyMetric[];
  leadsByOrigin: OriginMetric[];
}

export type ViewMode = 'dashboard' | 'kanban' | 'capture' | 'tech_lead_guide';
