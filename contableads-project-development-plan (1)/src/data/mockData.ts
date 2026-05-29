import { Lead, DashboardMetrics } from '../types';

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Carlos Eduardo Silva',
    company: 'CardioMed Clínicas',
    email: 'carlos@cardiomed.com.br',
    phone: '(11) 98845-6721',
    status: 'NEW',
    service: 'Troca de Contador',
    origin: 'Google Ads DPG',
    estimatedValue: 1800,
    notes: 'Clínica médica com 5 sócios e 12 funcionários. Insatisfeitos com o tempo de resposta do contador atual.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    history: [
      {
        id: 'h-1',
        type: 'CREATED',
        description: 'Lead capturado via Google Ads DPG (Campanha de Troca de Contador)',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'lead-2',
    name: 'Mariana Costa Sousa',
    company: 'TechGrowth Software',
    email: 'mariana@techgrowth.io',
    phone: '(11) 97123-4589',
    status: 'NEW',
    service: 'Abertura de Empresa',
    origin: 'Site Próprio',
    estimatedValue: 950,
    notes: 'Startup de tecnologia iniciando operações. Precisam de auxílio para escolha do regime tributário (Simples vs Lucro Presumido).',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    history: [
      {
        id: 'h-2',
        type: 'CREATED',
        description: 'Lead recebido pelo formulário do Site Próprio',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'lead-3',
    name: 'Roberto de Oliveira',
    company: 'Restaurante Bella Napoli',
    email: 'roberto@bellanapoli.com.br',
    phone: '(21) 99341-8890',
    status: 'CONTACTED',
    service: 'BPO Financeiro',
    origin: 'Instagram',
    estimatedValue: 2500,
    notes: 'Restaurante tradicional buscando terceirizar o financeiro (contas a pagar, receber e conciliação).',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    history: [
      {
        id: 'h-3',
        type: 'CREATED',
        description: 'Lead capturado via Instagram (Conteúdo sobre BPO)',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'h-4',
        type: 'STATUS_CHANGE',
        description: 'Status alterado para "Em Contato" - Primeira ligação realizada',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'lead-4',
    name: 'Fernanda Lima Nogueira',
    company: 'Nogueira Arquitetura',
    email: 'fernanda@nogueiraarq.com.br',
    phone: '(31) 98455-1122',
    status: 'CONTACTED',
    service: 'Consultoria Tributária',
    origin: 'Indicação',
    estimatedValue: 1200,
    notes: 'Escritório de arquitetura. Dúvidas sobre redução legal de impostos através de fator R.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    history: [
      {
        id: 'h-5',
        type: 'CREATED',
        description: 'Lead indicado por cliente atual (Dr. Henrique)',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'lead-5',
    name: 'Bruno Alves Peixoto',
    company: 'Peixoto & Filhos Varejo',
    email: 'diretoria@peixotovarejo.com.br',
    phone: '(41) 99100-3344',
    status: 'PROPOSAL',
    service: 'Troca de Contador',
    origin: 'SEO Local',
    estimatedValue: 3200,
    notes: 'Rede de 3 minimercados. Proposta enviada com honorários de R$ 3.200/mês para contabilidade completa + DP.',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    history: [
      {
        id: 'h-6',
        type: 'CREATED',
        description: 'Encontraram o escritório via busca no Google Maps (SEO Local)',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'h-7',
        type: 'PROPOSAL_SENT',
        description: 'Proposta comercial de R$ 3.200/mês enviada por e-mail',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'lead-6',
    name: 'Juliana Mendes',
    company: 'Mendes E-commerce',
    email: 'juliana@mendesstore.com',
    phone: '(11) 98333-7766',
    status: 'PROPOSAL',
    service: 'Abertura de Empresa',
    origin: 'Google Ads DPG',
    estimatedValue: 750,
    notes: 'Loja virtual na Nuvemshop. Apresentação feita. Aguardando de acordo dos sócios.',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    history: [
      {
        id: 'h-8',
        type: 'CREATED',
        description: 'Lead de campanha Google Ads DPG',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'lead-7',
    name: 'Ricardo de Souza Cruz',
    company: 'Logística Cruz',
    email: 'ricardo@logisticacruz.com.br',
    phone: '(19) 97744-5511',
    status: 'CLOSED',
    service: 'Troca de Contador',
    origin: 'Indicação',
    estimatedValue: 4100,
    notes: 'Contrato assinado! Cliente migrado da antiga contabilidade com sucesso. Onboarding iniciado.',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    history: [
      {
        id: 'h-9',
        type: 'CREATED',
        description: 'Indicação direta',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'h-10',
        type: 'STATUS_CHANGE',
        description: 'Negócio Fechado! Contrato assinado via ClickSign.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'lead-8',
    name: 'Patrícia Ribeiro',
    company: 'Ribeiro Consultoria RH',
    email: 'patricia@ribeirorh.com.br',
    status: 'CLOSED',
    phone: '(11) 96655-4433',
    service: 'Abertura de Empresa',
    origin: 'Google Ads DPG',
    estimatedValue: 600,
    notes: 'Abertura concluída. Cliente optou pelo plano de contabilidade digital.',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    history: [
      {
        id: 'h-11',
        type: 'CREATED',
        description: 'Google Ads DPG',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
];

export const INITIAL_METRICS: DashboardMetrics = {
  visitors: 3420,
  leadsCount: 84,
  conversionRate: 2.45,
  activeProposals: 14,
  estimatedPipeline: 24300,
  monthlyLeads: [
    { month: 'Set', leads: 42, proposals: 18, closed: 8 },
    { month: 'Out', leads: 56, proposals: 24, closed: 12 },
    { month: 'Nov', leads: 68, proposals: 32, closed: 15 },
    { month: 'Dez', leads: 48, proposals: 20, closed: 10 },
    { month: 'Jan', leads: 74, proposals: 35, closed: 18 },
    { month: 'Fev', leads: 84, proposals: 41, closed: 22 },
  ],
  leadsByOrigin: [
    { name: 'Google Ads DPG', value: 42, color: '#2563eb' }, // blue-600
    { name: 'SEO Local', value: 18, color: '#10b981' }, // emerald-500
    { name: 'Indicação', value: 12, color: '#f59e0b' }, // amber-500
    { name: 'Instagram', value: 8, color: '#ec4899' }, // pink-500
    { name: 'Site Próprio', value: 4, color: '#6366f1' }, // indigo-500
  ]
};
