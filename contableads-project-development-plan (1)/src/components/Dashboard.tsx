import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { FunnelStatus } from '../types';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight,
  HelpCircle,
  Megaphone,
  FileSpreadsheet,
  Filter
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { metrics, leads } = useCRM();
  
  // Estado para filtrar a lista recente com base no clique do card
  const [activeFilter, setActiveFilter] = useState<FunnelStatus | 'ALL'>('ALL');
  const [exporting, setExporting] = useState(false);

  // Formatar valores em Reais
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Filtragem dos leads para o feed interativo
  const filteredRecentLeads = React.useMemo(() => {
    const list = activeFilter === 'ALL' 
      ? leads 
      : leads.filter(l => l.status === activeFilter);
    
    return [...list]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [leads, activeFilter]);

  const handleSimulateExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      // Feedback visual via alert ou toast implícito
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome & Target Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-md text-xs font-semibold">
            <Megaphone className="w-3.5 h-3.5 text-blue-400" />
            <span>Demonstração de Performance — Grupo DPG</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard de Marketing Contábil</h1>
          <p className="text-slate-300 text-sm max-w-2xl">
            Acompanhe a eficácia do tráfego qualificado e a evolução do funil comercial do seu escritório. Os leads de sites e landing pages são injetados automaticamente aqui.
          </p>
        </div>
        
        {/* Export / Presentation Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <div className="bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10 text-center sm:text-right">
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Ticket Médio Contábil</div>
            <div className="text-base font-bold text-emerald-400">R$ 1.750 <span className="text-xs font-normal text-slate-400">/mês</span></div>
          </div>

          <button
            onClick={handleSimulateExport}
            disabled={exporting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center space-x-1.5 shadow-xs shrink-0 h-full"
            title="Exportar relatório gerencial em PDF para a diretoria"
          >
            {exporting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Gerando Relatório...</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Exportar Relatório</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Visitantes */}
        <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200/80 transition-all hover:shadow-md relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Visitantes Únicos</span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics.visitors.toLocaleString('pt-BR')}
            </div>
            <span className="text-xs font-semibold text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +12%
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Tráfego total das campanhas e site</p>
        </div>

        {/* Card 2: Leads */}
        <div 
          onClick={() => setActiveFilter(activeFilter === 'ALL' ? 'NEW' : 'ALL')}
          className={`bg-white rounded-xl p-5 shadow-xs border transition-all hover:shadow-md relative overflow-hidden group cursor-pointer ${
            activeFilter === 'NEW' ? 'ring-2 ring-emerald-500 border-transparent' : 'border-slate-200/80'
          }`}
          title="Clique para filtrar os leads recentes por 'Novos'"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 flex items-center">
              Total de Leads
              {activeFilter === 'NEW' && <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
            </span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics.leadsCount}
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {leads.filter(l => l.status !== 'CLOSED').length} Ativos
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400 flex items-center justify-between">
            <span>Contatos capturados no funil</span>
            <span className="text-[10px] text-emerald-600 group-hover:underline">Filtrar</span>
          </p>
        </div>

        {/* Card 3: Taxa de Conversão */}
        <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200/80 transition-all hover:shadow-md relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Taxa de Conversão</span>
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics.conversionRate}%
            </div>
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
              metrics.conversionRate >= 2.5 
                ? 'bg-emerald-50 text-emerald-700' 
                : 'bg-amber-50 text-amber-700'
            }`}>
              Meta: 2.5%
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Leads / Visitantes Únicos</p>
        </div>

        {/* Card 4: Valor do Pipeline */}
        <div 
          onClick={() => setActiveFilter(activeFilter === 'PROPOSAL' ? 'ALL' : 'PROPOSAL')}
          className={`bg-white rounded-xl p-5 shadow-xs border transition-all hover:shadow-md relative overflow-hidden group cursor-pointer ${
            activeFilter === 'PROPOSAL' ? 'ring-2 ring-violet-500 border-transparent' : 'border-slate-200/80'
          }`}
          title="Clique para filtrar os leads recentes por 'Proposta'"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-violet-600" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 flex items-center">
              Valor em Negociação
              {activeFilter === 'PROPOSAL' && <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse" />}
            </span>
            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {formatCurrency(metrics.estimatedPipeline)}
            </div>
            <span className="text-xs font-semibold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded">
              {metrics.activeProposals} Propostas
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400 flex items-center justify-between">
            <span>Soma de honorários estimados</span>
            <span className="text-[10px] text-violet-600 group-hover:underline">Filtrar</span>
          </p>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bar Chart: Leads por Mês */}
        <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200/80 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-semibold text-slate-900">Leads por Mês</h2>
              <div className="flex items-center space-x-4 text-xs">
                <span className="flex items-center text-slate-600">
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-xs mr-1.5"></span> Leads Totais
                </span>
                <span className="flex items-center text-slate-600">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs mr-1.5"></span> Contratos Fechados
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-4">Evolução comparativa de captação e fechamento comercial</p>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics.monthlyLeads}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="leads" name="Leads Capturados" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={45} />
                <Bar dataKey="closed" name="Contratos Fechados" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Origem dos Leads */}
        <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-semibold text-slate-900">Origem por Canal</h2>
              <div className="text-slate-400 hover:text-slate-600 cursor-help" title="Canais trabalhados pelo Grupo DPG e parceiros de tráfego">
                <HelpCircle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-slate-500">Distribuição do tráfego qualificado</p>
          </div>

          <div className="h-52 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.leadsByOrigin}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {metrics.leadsByOrigin.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#1e293b',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => [`${value} leads`, 'Quantidade']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legend */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-auto pt-2 border-t border-slate-50">
            {metrics.leadsByOrigin.map((item, idx) => (
              <div key={idx} className="flex items-center text-xs">
                <span 
                  className="w-2.5 h-2.5 rounded-full mr-1.5 shrink-0" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 truncate">{item.name}</span>
                <span className="ml-auto font-medium text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Recent Leads Feed with Active Filter Context */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-slate-900 text-sm">Leads Capturados Recentemente</h3>
            {activeFilter !== 'ALL' && (
              <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded flex items-center">
                <Filter className="w-2.5 h-2.5 mr-1" />
                Filtrado
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2 self-end sm:self-center">
            {activeFilter !== 'ALL' && (
              <button
                onClick={() => setActiveFilter('ALL')}
                className="text-xs text-blue-600 hover:underline"
              >
                Limpar Filtro
              </button>
            )}
            <span className="text-xs text-slate-400">
              {filteredRecentLeads.length} de {leads.length} leads
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-slate-100">
          {filteredRecentLeads.map((lead) => {
            const statusBadgeColors = {
              NEW: 'bg-blue-50 text-blue-700 border-blue-200',
              CONTACTED: 'bg-amber-50 text-amber-700 border-amber-200',
              PROPOSAL: 'bg-violet-50 text-violet-700 border-violet-200',
              CLOSED: 'bg-emerald-50 text-emerald-700 border-emerald-200'
            };

            const statusLabels = {
              NEW: 'Novo Lead',
              CONTACTED: 'Em Contato',
              PROPOSAL: 'Proposta',
              CLOSED: 'Fechado'
            };

            return (
              <div key={lead.id} className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-semibold text-xs shrink-0 mt-0.5">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm text-slate-900">{lead.name}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-medium text-slate-600">{lead.company}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
                      <span className="text-xs text-slate-500">{lead.email}</span>
                      <span className="text-xs text-slate-300">|</span>
                      <span className="text-xs text-slate-500">{lead.phone}</span>
                      <span className="text-xs text-slate-300">|</span>
                      <span className="text-xs text-slate-500 font-medium text-blue-600">{lead.service}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <div className="text-right hidden md:block">
                    <div className="text-xs font-medium text-slate-900">
                      {lead.estimatedValue ? formatCurrency(lead.estimatedValue) : 'A definir'}
                    </div>
                    <div className="text-[10px] text-slate-400">Origem: {lead.origin}</div>
                  </div>

                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusBadgeColors[lead.status]}`}>
                    {statusLabels[lead.status]}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredRecentLeads.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm">
              Nenhum lead encontrado para este filtro.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
