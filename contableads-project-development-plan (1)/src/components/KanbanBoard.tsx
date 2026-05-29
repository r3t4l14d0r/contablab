import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { FunnelStatus, Lead } from '../types';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  Search, 
  Filter, 
  Plus, 
  Building2, 
  Phone, 
  Calendar,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  DollarSign
} from 'lucide-react';
import { LeadDetailModal } from './LeadDetailModal';
import { NewLeadModal } from './NewLeadModal';

export const KanbanBoard: React.FC = () => {
  const { leads, updateLeadStatus } = useCRM();

  // Filtros locais
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<string>('ALL');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('ALL');
  
  // Controle de Modais
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

  // Configuração das colunas
  const columns: { id: FunnelStatus; title: string; colorClass: string; bgClass: string }[] = [
    { id: 'NEW', title: 'Novos Leads', colorClass: 'border-blue-500', bgClass: 'bg-blue-50/70' },
    { id: 'CONTACTED', title: 'Em Contato', colorClass: 'border-amber-500', bgClass: 'bg-amber-50/70' },
    { id: 'PROPOSAL', title: 'Proposta', colorClass: 'border-violet-500', bgClass: 'bg-violet-50/70' },
    { id: 'CLOSED', title: 'Fechado', colorClass: 'border-emerald-500', bgClass: 'bg-emerald-50/70' },
  ];

  // Filtragem dos leads
  const filteredLeads = React.useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesService = selectedService === 'ALL' || lead.service === selectedService;
      const matchesOrigin = selectedOrigin === 'ALL' || lead.origin === selectedOrigin;

      return matchesSearch && matchesService && matchesOrigin;
    });
  }, [leads, searchTerm, selectedService, selectedOrigin]);

  // Handle Drag & Drop
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // Se soltou no mesmo lugar, não faz nada
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Atualiza o status do lead para a nova coluna
    updateLeadStatus(draggableId, destination.droppableId as FunnelStatus);
  };

  // Funções para mover cards de forma acessível via botões
  const moveLeadAccessible = (leadId: string, currentStatus: FunnelStatus, direction: 'LEFT' | 'RIGHT') => {
    const statusOrder: FunnelStatus[] = ['NEW', 'CONTACTED', 'PROPOSAL', 'CLOSED'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    
    let newIndex = currentIndex;
    if (direction === 'LEFT' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'RIGHT' && currentIndex < statusOrder.length - 1) {
      newIndex = currentIndex + 1;
    }

    if (newIndex !== currentIndex) {
      updateLeadStatus(leadId, statusOrder[newIndex]);
    }
  };

  const formatCurrency = (val?: number) => {
    if (!val) return 'R$ 0';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Cálculos do Funil Comercial Ativo
  const activePipelineValue = React.useMemo(() => {
    return filteredLeads
      .filter(l => l.status !== 'CLOSED')
      .reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
  }, [filteredLeads]);

  return (
    <div className="space-y-6">
      
      {/* Metrics & Action Bar */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Left: Pipeline Summary */}
        <div className="flex items-center space-x-4">
          <div className="bg-slate-900 text-white p-2.5 rounded-lg flex items-center space-x-2 shrink-0">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Funil Filtrado</div>
              <div className="text-sm font-bold">{filteredLeads.length} oportunidades</div>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-medium">Receita Ativa Estimada</div>
              <div className="text-xs font-bold text-slate-900">{formatCurrency(activePipelineValue)} <span className="text-[10px] font-normal text-slate-400">/mês</span></div>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center justify-end">
          <button
            onClick={() => setIsNewLeadModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Lead Manual</span>
          </button>
        </div>

      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row items-center gap-2">
        
        {/* Search Input */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar lead por nome, empresa ou e-mail..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Service Filter */}
        <div className="relative w-full sm:w-auto shrink-0">
          <Filter className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full sm:w-auto pl-7 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-medium text-slate-700"
          >
            <option value="ALL">Todos os Serviços</option>
            <option value="Abertura de Empresa">Abertura de Empresa</option>
            <option value="Troca de Contador">Troca de Contador</option>
            <option value="BPO Financeiro">BPO Financeiro</option>
            <option value="Consultoria Tributária">Consultoria Tributária</option>
            <option value="Imposto de Renda">Imposto de Renda</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        {/* Origin Filter */}
        <div className="relative w-full sm:w-auto shrink-0">
          <select
            value={selectedOrigin}
            onChange={(e) => setSelectedOrigin(e.target.value)}
            className="w-full sm:w-auto px-3 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-medium text-slate-700"
          >
            <option value="ALL">Todas as Origens</option>
            <option value="Google Ads DPG">Google Ads DPG</option>
            <option value="SEO Local">SEO Local</option>
            <option value="Indicação">Indicação</option>
            <option value="Instagram">Instagram</option>
            <option value="Site Próprio">Site Próprio</option>
          </select>
        </div>

        {(searchTerm || selectedService !== 'ALL' || selectedOrigin !== 'ALL') && (
          <button
            onClick={() => { setSearchTerm(''); setSelectedService('ALL'); setSelectedOrigin('ALL'); }}
            className="text-xs text-blue-600 hover:underline px-2 shrink-0"
          >
            Limpar
          </button>
        )}

      </div>

      {/* Kanban Board Container */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          
          {columns.map((column) => {
            // Filtrar leads para esta coluna
            const columnLeads = filteredLeads.filter(l => l.status === column.id);
            
            // Somar o valor estimado
            const totalValue = columnLeads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0);

            return (
              <div 
                key={column.id} 
                className="rounded-xl border border-slate-200/80 bg-slate-100/60 p-3 flex flex-col h-[calc(100vh-250px)] min-h-[480px]"
              >
                {/* Column Header */}
                <div className={`border-t-4 ${column.colorClass} bg-white px-3.5 py-2.5 rounded-lg shadow-2xs mb-3 flex items-center justify-between`}>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm tracking-tight">{column.title}</h3>
                    <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                      {formatCurrency(totalValue)} <span className="text-slate-300">|</span> {columnLeads.length} {columnLeads.length === 1 ? 'lead' : 'leads'}
                    </div>
                  </div>
                  
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-semibold">
                    {columnLeads.length}
                  </span>
                </div>

                {/* Droppable Zone */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto space-y-2.5 pr-1 rounded-lg transition-colors ${
                        snapshot.isDraggingOver ? column.bgClass : ''
                      }`}
                    >
                      {columnLeads.map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                              }}
                              className={`bg-white rounded-lg p-3.5 shadow-2xs border transition-all select-none ${
                                snapshot.isDragging 
                                  ? 'ring-2 ring-blue-500 shadow-md rotate-1 border-transparent' 
                                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                              }`}
                            >
                              {/* Card Top: Origin & Actions */}
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                  {lead.origin}
                                </span>

                                {/* Accessible Movement Controls */}
                                <div className="flex items-center space-x-0.5">
                                  {column.id !== 'NEW' && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); moveLeadAccessible(lead.id, column.id, 'LEFT'); }}
                                      title="Mover para a coluna anterior"
                                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded transition-colors"
                                    >
                                      <ChevronLeft className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {column.id !== 'CLOSED' && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); moveLeadAccessible(lead.id, column.id, 'RIGHT'); }}
                                      title="Mover para a próxima coluna"
                                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded transition-colors"
                                    >
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Clickable Card Content */}
                              <div 
                                onClick={() => setActiveLead(lead)}
                                className="cursor-pointer group"
                              >
                                <h4 className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                                  {lead.name}
                               </h4>
                                
                                <div className="flex items-center text-xs text-slate-500 mt-1">
                                  <Building2 className="w-3 h-3 mr-1 shrink-0 text-slate-400" />
                                  <span className="truncate">{lead.company}</span>
                                </div>

                                <div className="flex items-center text-xs text-slate-500 mt-0.5">
                                  <Phone className="w-3 h-3 mr-1 shrink-0 text-slate-400" />
                                  <span className="truncate">{lead.phone}</span>
                                </div>

                                {/* Service Tag */}
                                <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100">
                                  <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                                    {lead.service}
                                  </span>

                                  <span className="text-xs font-bold text-slate-800">
                                    {lead.estimatedValue ? formatCurrency(lead.estimatedValue) : <span className="text-[10px] text-slate-400 font-normal">A definir</span>}
                                  </span>
                                </div>

                                {/* Card footer info */}
                                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                                  <span className="flex items-center">
                                    <Calendar className="w-2.5 h-2.5 mr-1" />
                                    {new Date(lead.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                  </span>
                                  
                                  <span className="text-slate-400 hover:text-slate-600 flex items-center">
                                    <span>Detalhes</span>
                                    <MoreHorizontal className="w-3 h-3 ml-0.5" />
                                  </span>
                                </div>
                              </div>

                            </div>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}

                      {columnLeads.length === 0 && (
                        <div className="h-28 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 text-xs text-center p-4">
                          <span>Nenhum lead nesta etapa</span>
                          <span className="text-[10px] text-slate-300 mt-1">Arraste cards ou cadastre novos</span>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>

                {/* Column Quick Create Button */}
                <button
                  onClick={() => setIsNewLeadModalOpen(true)}
                  className="mt-2 w-full py-1.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-medium rounded-lg border border-slate-200 transition-colors flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Adicionar à etapa</span>
                </button>
              </div>
            );
          })}

        </div>
      </DragDropContext>

      {/* Detail Modal */}
      {activeLead && (
        <LeadDetailModal
          lead={activeLead}
          onClose={() => setActiveLead(null)}
        />
      )}

      {/* New Lead Modal */}
      {isNewLeadModalOpen && (
        <NewLeadModal
          onClose={() => setIsNewLeadModalOpen(false)}
        />
      )}

    </div>
  );
};
