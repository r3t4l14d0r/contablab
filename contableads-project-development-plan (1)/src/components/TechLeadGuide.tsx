import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  FileCode, 
  Database, 
  Layers
} from 'lucide-react';

export const TechLeadGuide: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const nextSetupCmd = `npx create-next-app@latest contableads \\
  --typescript \\
  --tailwind \\
  --eslint \\
  --app \\
  --src-dir \\
  --import-alias "@/*"`;

  const prismaSetupCmd = `# 1. Instalar a CLI do Prisma como dependência de desenvolvimento
npm install prisma --save-dev

# 2. Instalar o Client do Prisma para o código da aplicação
npm install @prisma/client

# 3. Inicializar o Prisma configurando o provedor como SQLite
npx prisma init --datasource-provider sqlite`;

  const prismaSchemaCode = `// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

// ==========================================
// MODELO DE DADOS: LEADS CONTÁBEIS
// ==========================================

model Lead {
  id             String        @id @default(uuid())
  name           String
  company        String
  email          String
  phone          String
  status         String        @default("NEW") // "NEW", "CONTACTED", "PROPOSAL", "CLOSED"
  service        String        // "Troca de Contador", "Abertura de Empresa", etc.
  origin         String        // "Google Ads DPG", "SEO Local", "Instagram", etc.
  estimatedValue Float?        // Valor da mensalidade estimada (Honorários)
  notes          String?       // Escopo e anotações do cliente
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  // Relacionamentos
  history        LeadHistory[]

  @@index([status])
  @@index([createdAt])
  @@map("leads")
}

// ==========================================
// MODELO DE DADOS: HISTÓRICO / AUDIT TRAIL
// ==========================================

model LeadHistory {
  id          String   @id @default(uuid())
  leadId      String
  type        String   // "CREATED", "STATUS_CHANGE", "NOTE_ADDED"
  description String
  createdAt   DateTime @default(now())

  // Relacionamento
  lead        Lead     @relation(fields: [leadId], references: [id], onDelete: Cascade)

  @@index([leadId])
  @@map("lead_history")
}
`;

  const migrateCmd = `# 1. Criar e aplicar a primeira migração no banco SQLite
npx prisma migrate dev --name init_leads_schema

# 2. Gerar a tipagem atualizada do Prisma Client
npx prisma generate

# 3. Abrir o painel visual do Prisma Studio para testar o banco
npx prisma studio`;

  const apiRouteCode = `// src/app/api/leads/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, service, origin, notes } = body;

    // Validação de campos obrigatórios
    if (!name || !company) {
      return NextResponse.json(
        { success: false, error: 'Nome e Empresa são campos obrigatórios.' },
        { status: 400 }
      );
    }

    // Inserção transacional do Lead + Histórico Inicial
    const newLead = await prisma.lead.create({
      data: {
        name,
        company,
        email: email || '',
        phone: phone || '',
        service: service || 'Troca de Contador',
        origin: origin || 'Site Próprio',
        notes: notes || '',
        history: {
          create: {
            type: 'CREATED',
            description: \`Lead capturado via \${origin || 'Site Próprio'}\`,
          }
        }
      },
      include: {
        history: true
      }
    });

    return NextResponse.json(
      { success: true, data: newLead },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro na rota POST /api/leads:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno no servidor ao processar o lead.' },
      { status: 500 }
    );
  }
}
`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Intro block */}
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md border border-slate-800">
        <div className="flex items-center space-x-2 text-emerald-400 mb-2">
          <Terminal className="w-5 h-5" />
          <span className="text-xs font-mono uppercase tracking-widest font-bold">Tech Lead Guidance — Passo 1</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Arquitetura e Inicialização do Projeto</h1>
        <p className="text-slate-300 text-sm mt-1">
          Aqui estão os comandos exatos de terminal e os modelos de banco de dados para a fundação do <strong>ContabLeads</strong>. O setup com <strong>SQLite + Prisma ORM</strong> foi estrategicamente escolhido para permitir um deploy imediato e testes de portfólio robustos para o <strong>Grupo DPG</strong>.
        </p>

        <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
            <span className="text-slate-400 block">Framework:</span>
            <strong className="text-white">Next.js 15 (App Router)</strong>
          </div>
          <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
            <span className="text-slate-400 block">Banco de Dados:</span>
            <strong className="text-emerald-400">SQLite (Prisma ORM)</strong>
          </div>
          <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
            <span className="text-slate-400 block">Estilização:</span>
            <strong className="text-blue-400">Tailwind CSS + Shadcn</strong>
          </div>
        </div>
      </div>

      {/* Step 1: Next.js Init */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-900">1. Inicialização do Next.js com Tailwind e TypeScript</h2>
          </div>
          <button
            onClick={() => handleCopy(nextSetupCmd, 'next')}
            className="text-xs flex items-center space-x-1 bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200 transition-colors font-medium"
          >
            {copiedSection === 'next' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copiar Comando</span>
              </>
            )}
          </button>
        </div>
        
        <div className="p-4 bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto">
          <pre>{nextSetupCmd}</pre>
        </div>

        <div className="px-6 py-3 bg-slate-50 text-xs text-slate-500 border-t border-slate-100">
          💡 <strong>Dica do Tech Lead:</strong> Utilizamos o alias <code>@/*</code> e o diretório <code>src/</code> para manter o código da aplicação limpo e separado dos arquivos de configuração da raiz.
        </div>
      </div>

      {/* Step 2: Prisma & SQLite Init */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-semibold text-slate-900">2. Instalação do Prisma ORM e Setup do SQLite</h2>
          </div>
          <button
            onClick={() => handleCopy(prismaSetupCmd, 'prisma')}
            className="text-xs flex items-center space-x-1 bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200 transition-colors font-medium"
          >
            {copiedSection === 'prisma' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copiar Comandos</span>
              </>
            )}
          </button>
        </div>
        
        <div className="p-4 bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto">
          <pre>{prismaSetupCmd}</pre>
        </div>
      </div>

      {/* Step 3: schema.prisma */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileCode className="w-4 h-4 text-violet-600" />
            <h2 className="text-sm font-semibold text-slate-900">3. Arquivo de Modelagem de Banco (<code className="text-xs bg-slate-200/70 px-1 py-0.2 rounded text-slate-800">prisma/schema.prisma</code>)</h2>
          </div>
          <button
            onClick={() => handleCopy(prismaSchemaCode, 'schema')}
            className="text-xs flex items-center space-x-1 bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200 transition-colors font-medium"
          >
            {copiedSection === 'schema' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copiar Schema</span>
              </>
            )}
          </button>
        </div>
        
        <div className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto">
          <pre>{prismaSchemaCode}</pre>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2 text-xs text-slate-600">
          <p className="font-semibold text-slate-900">Decisões de Modelagem focadas no nicho Contábil:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Campos Específicos:</strong> Adicionamos <code>service</code> e <code>origin</code> para mensurar de qual canal de marketing do Grupo DPG os leads estão surgindo e qual o serviço de maior interesse.</li>
            <li><strong>Valor do Pipeline:</strong> O campo <code>estimatedValue</code> armazena a expectativa de honorários mensais para alimentar o Dashboard de Vendas.</li>
            <li><strong>Tabela de Histórico (Audit Trail):</strong> A tabela <code>LeadHistory</code> com <code>onDelete: Cascade</code> garante que cada avanço de etapa ou follow-up fique rastreado de forma transparente para o contador.</li>
          </ul>
        </div>
      </div>

      {/* Step 4: Migrations */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-semibold text-slate-900">4. Executando as Migrações e Testando o Banco</h2>
          </div>
          <button
            onClick={() => handleCopy(migrateCmd, 'migrate')}
            className="text-xs flex items-center space-x-1 bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200 transition-colors font-medium"
          >
            {copiedSection === 'migrate' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copiar Comandos</span>
              </>
            )}
          </button>
        </div>
        
        <div className="p-4 bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto">
          <pre>{migrateCmd}</pre>
        </div>
      </div>

      {/* Bonus Step: API Route */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileCode className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-900">Bônus: Implementação da Rota de Captura (<code className="text-xs bg-slate-200/70 px-1 py-0.2 rounded text-slate-800">src/app/api/leads/route.ts</code>)</h2>
          </div>
          <button
            onClick={() => handleCopy(apiRouteCode, 'api')}
            className="text-xs flex items-center space-x-1 bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200 transition-colors font-medium"
          >
            {copiedSection === 'api' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copiar Rota de API</span>
              </>
            )}
          </button>
        </div>
        
        <div className="p-4 bg-slate-950 text-blue-300 font-mono text-xs overflow-x-auto">
          <pre>{apiRouteCode}</pre>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-600">
          🚀 Com esta rota construída no Next.js App Router, qualquer site parceiro do <strong>Grupo DPG</strong> pode fazer um <code>POST</code> com os dados do cliente e ver o card surgir em tempo real no Kanban do contador!
        </div>
      </div>

    </div>
  );
};
