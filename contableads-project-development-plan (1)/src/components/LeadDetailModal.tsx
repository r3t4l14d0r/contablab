import React, { useState } from 'react';
import { Lead, FunnelStatus, ServiceType } from '../types';
import { useCRM } from '../context/CRMContext';
import { 
  X, 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  History, 
  Send,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, onClose }) => {
  const { updateLeadStatus, updateLead, addLeadHistory } = useCRM();
  
  const [estimatedValue, setEstimatedValue] = useState<string>(
    lead.estimatedValue ? lead.estimatedValue.toString() : ''
  );
  const [newNote, setNewNote] = useState('');
  const [service, setService] = useState<ServiceType>(lead.service);

  const statusLabels: Record<FunnelStatus, string> = {
    NEW: 'Novo Lead',
    CONTACTED: 'Em Contato',
    PROPOSAL: 'Proposta Enviada',
    CLOSED: 'Negócio Fechado'
  };

  const statusColors: Record<FunnelStatus, string> = {
    NEW: 'bg-blue-100 text-blue-800 border-blue-200',
    CONTACTED: 'bg-amber-100 text-amber-800 border-amber-200',
    PROPOSAL: 'bg-violet-100 text-violet-800 border-violet-200',
    CLOSED: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  };

  const handleSaveValue = () => {
    const numericVal = parseFloat(estimatedValue);
    if (!isNaN(numericVal)) {
      updateLead(lead.id, { estimatedValue: numericVal });
      addLeadHistory(
        lead.id, 
        'NOTE_ADDED', 
        `Valor estimado atualizado para R$ ${numericVal.toLocaleString('pt-BR')}`
      );
    }
  };

  const handleSaveService = (newService: ServiceType) => {
    setService(newService);
    updateLead(lead.id, { service: newService });
    addLeadHistory(
      lead.id,
      'NOTE_ADDED',
      `Serviço de interesse alterado para: ${newService}`
    );
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    addLeadHistory(lead.id, 'NOTE_ADDED', newNote.trim());
    
    // Anexar às notas gerais do lead
    const updatedNotes = lead.notes 
      ? `${lead.notes}\n\n[${new Date().toLocaleDateString()}] ${newNote.trim()}`
      : newNote.trim();

    updateLead(lead.id, { notes: updatedNotes });
    setNewNote('');
  };

  const handleStatusChange = (newStatus: FunnelStatus) => {
    updateLeadStatus(lead.id, newStatus);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-lg border border-slate-700">
              {lead.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold leading-tight">{lead.name}</h2>
              <p className="text-xs text-slate-400 flex items-center mt-0.5">
                <Building2 className="w-3 h-3 mr-1" /> {lead.company}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${statusColors[lead.status]}`}>
              {statusLabels[lead.status]}
            </span>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          
          {/* Quick Actions / Status Mover */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Avançar Funil de Vendas
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['NEW', 'CONTACTED', 'PROPOSAL', 'CLOSED'] as FunnelStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center space-x-1 ${
                    lead.status === st
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{statusLabels[st]}</span>
                  {lead.status === st && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />}
                </button>
              ))}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Contact & Commercial Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 border-b pb-2">Informações de Contato</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">{lead.email}</a>
                </div>

                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`https://api.whatsapp.com/send?phone=${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-slate-700 hover:text-emerald-600 flex items-center">
                    <span>{lead.phone}</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 ml-2 rounded">WhatsApp</span>
                  </a>
                </div>

                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-slate-600">Capturado em: {formatDate(lead.createdAt)}</span>
                </div>

                <div className="flex items-center space-x-3 text-sm pt-1">
                  <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded border">
                    Origem: <strong className="text-slate-900">{lead.origin}</strong>
                  </span>
                </div>
              </div>

              {/* Commercial Setup */}
              <h3 className="text-sm font-semibold text-slate-900 border-b pb-2 pt-2">Dados do Negócio</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Serviço Contábil de Interesse</label>
                  <select
                    value={service}
                    onChange={(e) => handleSaveService(e.target.value as ServiceType)}
                    className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Abertura de Empresa">Abertura de Empresa</option>
                    <option value="Troca de Contador">Troca de Contador</option>
                    <option value="BPO Financeiro">BPO Financeiro</option>
                    <option value="Consultoria Tributária">Consultoria Tributária</option>
                    <option value="Imposto de Renda">Imposto de Renda</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Honorários Mensais Estimados (R$)
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm">
                        R$
                      </div>
                      <input
                        type="number"
                        value={estimatedValue}
                        onChange={(e) => setEstimatedValue(e.target.value)}
                        placeholder="Ex: 1500"
                        className="w-full pl-8 pr-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={handleSaveValue}
                      className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Follow-up & Timeline */}
            <div className="space-y-4 flex flex-col justify-between">
              
              <div>
                <h3 className="text-sm font-semibold text-slate-900 border-b pb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-1.5 text-slate-400" />
                  Anotações e Escopo
                </h3>
                
                <div className="mt-3 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 whitespace-pre-wrap max-h-36 overflow-y-auto">
                  {lead.notes || <span className="text-slate-400 italic">Nenhuma anotação de escopo registrada.</span>}
                </div>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2 pt-2">
                <label className="block text-xs font-medium text-slate-700">Adicionar Follow-up</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Ex: Reunião agendada para amanhã às 14h..."
                    className="flex-1 text-sm bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

            </div>

          </div>

          {/* Audit History / Timeline */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center">
              <History className="w-4 h-4 mr-1.5 text-slate-400" />
              Histórico de Atividades
            </h3>

            <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
              {lead.history.map((item) => {
                const typeColors = {
                  CREATED: 'bg-blue-50 text-blue-700 border-blue-200',
                  STATUS_CHANGE: 'bg-violet-50 text-violet-700 border-violet-200',
                  NOTE_ADDED: 'bg-slate-100 text-slate-700 border-slate-200',
                  PROPOSAL_SENT: 'bg-amber-50 text-amber-700 border-amber-200'
                };

                return (
                  <div key={item.id} className="flex items-start space-x-3 text-xs">
                    <div className="mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="flex-1 bg-slate-50 p-2 rounded border border-slate-100">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${typeColors[item.type]}`}>
                          {item.type}
                        </span>
                        <span className="text-slate-400 text-[10px]">{formatDate(item.createdAt)}</span>
                      </div>
                      <p className="text-slate-700">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white text-sm px-4 py-1.5 rounded-lg transition-colors font-medium"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
