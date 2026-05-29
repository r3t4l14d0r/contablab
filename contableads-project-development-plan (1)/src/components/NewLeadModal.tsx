import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { FunnelStatus, ServiceType, LeadOrigin } from '../types';
import { X, UserPlus } from 'lucide-react';

interface NewLeadModalProps {
  onClose: () => void;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({ onClose }) => {
  const { addLead } = useCRM();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState<ServiceType>('Abertura de Empresa');
  const [origin, setOrigin] = useState<LeadOrigin>('Indicação');
  const [status, setStatus] = useState<FunnelStatus>('NEW');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim()) return;

    addLead({
      name,
      company,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@empresa.com`,
      phone: phone || '(11) 99999-9999',
      service,
      origin,
      status,
      estimatedValue: estimatedValue ? parseFloat(estimatedValue) : undefined,
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-semibold">Cadastrar Novo Lead Contábil</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Nome do Contato *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Roberto Silva"
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Nome da Empresa *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ex: Comercial Silva Ltda"
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contato@empresa.com.br"
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Telefone / WhatsApp</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 98888-7777"
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Serviço de Interesse</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value as ServiceType)}
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
              <label className="block text-xs font-medium text-slate-700 mb-1">Canal de Origem</label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value as LeadOrigin)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Google Ads DPG">Google Ads DPG</option>
                <option value="SEO Local">SEO Local</option>
                <option value="Indicação">Indicação</option>
                <option value="Instagram">Instagram</option>
                <option value="Site Próprio">Site Próprio</option>
                <option value="Landing Page">Landing Page</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Etapa Inicial do Funil</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as FunnelStatus)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="NEW">Novos Leads</option>
                <option value="CONTACTED">Em Contato</option>
                <option value="PROPOSAL">Proposta</option>
                <option value="CLOSED">Fechado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Honorários Mensais (R$)</label>
              <input
                type="number"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                placeholder="Ex: 1200"
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Anotações Iniciais / Escopo</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descreva o porte da empresa, quantidade de funcionários, regime tributário atual..."
              className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="border-t pt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              Cadastrar Lead
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
