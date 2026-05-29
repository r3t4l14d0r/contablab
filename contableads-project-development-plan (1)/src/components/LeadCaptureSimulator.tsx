import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { ServiceType, LeadOrigin } from '../types';
import { 
  Send, 
  Server, 
  CheckCircle2, 
  Code, 
  Sparkles, 
  Globe,
  Database
} from 'lucide-react';

export const LeadCaptureSimulator: React.FC = () => {
  const { addLead } = useCRM();

  // Formulário Público do Site do Contador
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState<ServiceType>('Troca de Contador');
  const [origin, setOrigin] = useState<LeadOrigin>('Google Ads DPG');
  const [message, setMessage] = useState('');

  // Estado da Simulação da API
  const [loading, setLoading] = useState(false);
  const [lastPayload, setLastPayload] = useState<any>(null);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [success, setSuccess] = useState(false);

  // Preenchimento de dados sugeridos para facilitar os testes
  const handlePrefill = (type: 'clinica' | 'ecommerce' | 'restaurante') => {
    if (type === 'clinica') {
      setName('Dra. Amanda Nogueira');
      setCompany('OdontoSorridente');
      setEmail('amanda@odontosorridente.com.br');
      setPhone('(11) 98455-1234');
      setService('Troca de Contador');
      setOrigin('Google Ads DPG');
      setMessage('Temos 3 dentistas parceiros e precisamos de suporte para redução de carga tributária no Simples Nacional.');
    } else if (type === 'ecommerce') {
      setName('Felipe Brandão');
      setCompany('Brandão Store');
      setEmail('felipe@brandaostore.com');
      setPhone('(41) 99122-8877');
      setService('Abertura de Empresa');
      setOrigin('Instagram');
      setMessage('Iniciando vendas no Mercado Livre e Shopee. Preciso abrir um CNPJ urgente para emitir notas fiscais.');
    } else {
      setName('Sérgio Reis');
      setCompany('Pizzaria Forno D\'Oro');
      setEmail('contato@fornodoro.com.br');
      setPhone('(21) 97766-5544');
      setService('BPO Financeiro');
      setOrigin('SEO Local');
      setMessage('Gostaria de terceirizar o contas a pagar e a folha de pagamento dos nossos 8 entregadores.');
    }
  };

  const handleApiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim()) return;

    setLoading(true);
    setSuccess(false);

    // Monta o payload que o front-end enviaria para a rota Next.js
    const payload = {
      name,
      company,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@empresa.com`,
      phone: phone || '(11) 99999-9999',
      service,
      origin,
      notes: message || 'Nenhuma mensagem adicional.',
      source: 'https://site-do-contador.com.br/contato'
    };

    setLastPayload(payload);

    // Simula o tempo de resposta do Next.js App Router e do Prisma/SQLite
    setTimeout(() => {
      // Injeta no CRM Context (Simula a gravação do Prisma no SQLite)
      addLead({
        name: payload.name,
        company: payload.company,
        email: payload.email,
        phone: payload.phone,
        service: payload.service as ServiceType,
        origin: payload.origin as LeadOrigin,
        status: 'NEW',
        notes: payload.notes,
        estimatedValue: payload.service === 'Troca de Contador' ? 1800 : payload.service === 'BPO Financeiro' ? 2200 : 900
      });

      // Retorno JSON simulado da rota de API
      setLastResponse({
        success: true,
        message: "Lead capturado e integrado ao CRM com sucesso",
        data: {
          id: `lead-${Date.now()}`,
          name: payload.name,
          company: payload.company,
          status: "NEW",
          createdAt: new Date().toISOString()
        },
        prisma_status: "Record successfully created in SQLite database"
      });

      setLoading(false);
      setSuccess(true);

      // Limpa os campos após 3 segundos
      setTimeout(() => {
        setSuccess(false);
        setName('');
        setCompany('');
        setEmail('');
        setPhone('');
        setMessage('');
      }, 4000);

    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Explicativo */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center">
          <Server className="w-5 h-5 mr-2 text-emerald-500" />
          Simulação da Rota de API Pública (<code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-sm font-mono">POST /api/leads</code>)
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Esta tela demonstra a capacidade do sistema de receber dados externos (como os formulários de contato de sites desenvolvidos ou otimizados pelo <strong>Grupo DPG</strong>) e convertê-los automaticamente em novas oportunidades no funil do Kanban.
        </p>

        {/* Sugestões de preenchimento rápido */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Autopreencher com dados reais:</span>
          <button 
            onClick={() => handlePrefill('clinica')}
            className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-md transition-colors border"
          >
            🦷 Clínica Médica
          </button>
          <button 
            onClick={() => handlePrefill('ecommerce')}
            className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-md transition-colors border"
          >
            📦 E-commerce
          </button>
          <button 
            onClick={() => handlePrefill('restaurante')}
            className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-md transition-colors border"
          >
            🍕 Restaurante Local
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Side: Front-end form simulating Client Website */}
        <div className="bg-slate-900 text-white rounded-xl shadow-md overflow-hidden border border-slate-800">
          
          {/* Simulated Browser Header */}
          <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            </div>
            <div className="bg-slate-900 rounded px-3 py-0.5 text-[11px] text-slate-400 font-mono flex items-center space-x-1.5 mx-auto w-4/5 truncate">
              <Globe className="w-3 h-3 text-slate-500 shrink-0" />
              <span className="truncate">https://site-do-contador.com.br/contato</span>
            </div>
          </div>

          {/* Form Header */}
          <div className="p-6 bg-gradient-to-br from-slate-900 to-blue-950 text-center border-b border-slate-800">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              Contabilidade Premium
            </span>
            <h3 className="text-xl font-bold mt-2">Solicite uma Proposta Contábil</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
              Preencha os dados abaixo. Nosso time comercial entrará em contato em menos de 15 minutos.
            </p>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleApiSubmit} className="p-6 space-y-4">
            
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Seu Nome *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Nogueira"
                className="w-full text-sm bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nome da sua Empresa *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ex: Nogueira & Filhos Comércio"
                className="w-full text-sm bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">E-mail Corporativo</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="carlos@empresa.com.br"
                  className="w-full text-sm bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp / Celular</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 98888-7777"
                  className="w-full text-sm bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Serviço Desejado</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value as ServiceType)}
                  className="w-full text-sm bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Troca de Contador">Troca de Contador</option>
                  <option value="Abertura de Empresa">Abertura de Empresa</option>
                  <option value="BPO Financeiro">BPO Financeiro</option>
                  <option value="Consultoria Tributária">Consultoria Tributária</option>
                  <option value="Imposto de Renda">Imposto de Renda</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Como nos conheceu?</label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value as LeadOrigin)}
                  className="w-full text-sm bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Google Ads DPG">Google Ads (Campanha DPG)</option>
                  <option value="SEO Local">Busca no Google Maps</option>
                  <option value="Instagram">Instagram / Redes Sociais</option>
                  <option value="Indicação">Indicação de Cliente</option>
                  <option value="Site Próprio">Acesso Direto</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Mensagem (Opcional)</label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Descreva brevemente sua necessidade contábil ou dúvidas..."
                className="w-full text-sm bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center space-x-2 ${
                success 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white shadow-md'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Enviando para a API...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Lead Integrado ao CRM!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Enviar Solicitação de Orçamento</span>
                </>
              )}
            </button>

          </form>

        </div>

        {/* Right Side: Back-end API Console & Next.js Processing */}
        <div className="space-y-4">
          
          {/* Status Box */}
          <div className="bg-slate-900 rounded-xl p-4 text-white border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Console do Servidor Next.js</span>
              </div>
              <span className="text-[10px] font-mono bg-slate-800 text-emerald-400 px-2 py-0.5 rounded">
                Prisma ORM | SQLite
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                <span>Servidor escutando na rota <strong className="text-white">/api/leads</strong></span>
              </div>

              {loading && (
                <div className="text-amber-400 bg-amber-950/30 p-2 rounded border border-amber-900/50">
                  <p className="font-semibold mb-1">⚡ [POST] Requisição Recebida</p>
                  <p className="text-slate-300 text-[11px]">Validando schema com Zod e instanciando conexão PrismaClient...</p>
                </div>
              )}

              {success && (
                <div className="text-emerald-400 bg-emerald-950/30 p-2 rounded border border-emerald-900/50 space-y-1 animate-in fade-in">
                  <p className="font-semibold">✓ [201 Created] Lead Processado</p>
                  <p className="text-slate-300 text-[11px] flex items-center">
                    <Database className="w-3 h-3 mr-1 text-blue-400" />
                    Registro gravado na tabela <span className="text-white underline ml-1">leads</span> do SQLite.
                  </p>
                </div>
              )}

              {!lastPayload && !loading && (
                <div className="text-slate-500 italic p-4 text-center">
                  Aguardando envio do formulário ao lado para exibir os logs da requisição...
                </div>
              )}
            </div>
          </div>

          {/* Payload Viewer */}
          {lastPayload && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Payload Enviado (Request Body)</span>
                <span className="text-[10px] font-mono text-slate-400">application/json</span>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto max-h-48">
                {JSON.stringify(lastPayload, null, 2)}
              </pre>
            </div>
          )}

          {/* Response Viewer */}
          {lastResponse && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Resposta da API (Response Body)</span>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">HTTP 201</span>
              </div>
              <pre className="p-4 bg-slate-950 text-emerald-400 text-xs font-mono overflow-x-auto max-h-48">
                {JSON.stringify(lastResponse, null, 2)}
              </pre>
            </div>
          )}

          {/* Call to action connecting to the board */}
          {success && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-medium text-blue-900">
                  O lead foi adicionado com sucesso à coluna <strong>"Novos Leads"</strong> no Kanban!
                </span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
