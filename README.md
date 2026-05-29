# 📊 ContabLeads

> **Mini-CRM e Dashboard de Marketing para Escritórios de Contabilidade**  
> *Portfólio de Engenharia de Software desenvolvido com foco no **Grupo DPG**.*

---

## 🎯 Objetivo do Projeto

O **ContabLeads** nasceu para preencher a lacuna entre a **captação de tráfego qualificado** e a **conversão comercial** em escritórios de contabilidade. 

Agências de alta performance como o **Grupo DPG** geram centenas de oportunidades mensais através de campanhas no Google Ads, SEO Local e mídias sociais. No entanto, muitos contadores ainda gerenciam esses contatos em planilhas ou sistemas genéricos e complexos. 

Esta aplicação oferece uma experiência **limpa, veloz e corporativa**, permitindo que o contador visualize o retorno de suas campanhas de marketing em tempo real e avance os leads por um funil de vendas (Kanban) simples e focado no seu nicho de atuação.

---

## 🚀 Tech Stack e Decisões de Arquitetura

A arquitetura foi planejada para unir o estado da arte do ecossistema React com a máxima facilidade de deploy e avaliação:

* **Framework:** [Next.js 15 (App Router)](https://nextjs.org/) com **TypeScript** para máxima tipagem estática e Server Actions.
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/) com design system corporativo inspirado nos componentes do **Shadcn UI**.
* **Banco de Dados:** **SQLite** gerenciado através do [Prisma ORM](https://www.prisma.io/). 
  > *Decisão do Tech Lead:* O SQLite foi estrategicamente escolhido por ser autossuficiente e baseado em arquivo (`dev.db`). Ele dispensa a configuração de instâncias na nuvem ou containers Docker, permitindo que a liderança do **Grupo DPG** clone o projeto e o teste localmente sem nenhum atrito.
* **Gráficos e Visualização de Dados:** [Recharts](https://recharts.org/), garantindo renderização responsiva e suporte nativo a animações.
* **Kanban (Drag and Drop):** [`@hello-pangea/dnd`](https://github.com/hello-pangea/dnd), a biblioteca oficial e otimizada que dá continuidade ao *react-beautiful-dnd*, com suporte total a React 18+ e App Router.

---

## 📦 Funcionalidades Principais

### 1. Dashboard de Marketing e Performance
Uma tela inicial projetada para demonstrar o valor gerado pela agência de tráfego:
* **Cards de Métricas em Tempo Real:** Visitantes Únicos, Total de Leads no Funil, Taxa de Conversão (com meta inteligente) e Valor Estimado do Pipeline (Honorários Recorrentes).
* **Gráfico de Captação Mensal:** Gráfico de barras duplo contrastando o volume de *Leads Capturados* com o número de *Contratos Fechados*.
* **Distribuição de Tráfego:** Gráfico de pizza mapeando a eficácia de cada canal trabalhado pelo Grupo DPG (*Google Ads DPG*, *SEO Local*, *Instagram* e *Indicações*).
* **Feed Interativo:** Filtre os leads recentes acionando os cards do topo com um clique.

### 2. CRM para Contadores (Quadro Kanban)
O coração comercial do escritório:
* **As 4 Etapas do Funil Contábil:** *"Novos Leads"*, *"Em Contato"*, *"Proposta"* e *"Fechado"*.
* **Métricas por Coluna:** Cada etapa calcula dinamicamente o volume de leads e a **soma de honorários mensais** parados na fase.
* **Drag and Drop de Alta Fidelidade:** Mova os cards entre as colunas de forma fluida. O sistema também oferece **botões de avanço rápido** para acessibilidade completa via mobile e tablets.
* **Modal de Detalhes:** Histórico de interações com trilha de auditoria (Audit Trail) e adição de notas de *Follow-up*.
* **Filtros de Nicho:** Busque por texto, filtre pelo serviço contábil (*Abertura de Empresa*, *BPO Financeiro*, *Troca de Contador*, etc.) ou pelo canal de aquisição.

### 3. Simulador de Rota de API (Captura Externa)
Demonstração técnica da capacidade de injeção de dados:
* **Formulário Público do Site:** Simula a landing page do contador onde o cliente final solicita uma proposta.
* **Console do Servidor Next.js:** Exibe, em tempo real, o recebimento do payload JSON na rota `POST /api/leads`, os logs de validação e a gravação relacional no banco SQLite via Prisma. O lead surge instantaneamente na primeira coluna do Kanban!

### 4. Guia do Tech Lead (Documentação CLI)
Uma aba dedicada que expõe os comandos exatos de setup do Next.js e a modelagem sênior do `schema.prisma` para avaliação técnica imediata.

---

## 🛠️ Como Rodar o Projeto Localmente

Siga o passo a passo abaixo para inicializar o ambiente de desenvolvimento:

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/contableads.git
cd contableads
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure e inicialize o Banco de Dados (SQLite + Prisma)
O comando abaixo irá ler o arquivo `prisma/schema.prisma`, criar o banco de dados `dev.db` na sua máquina e aplicar as migrações iniciais:
```bash
npx prisma migrate dev --name init_leads_schema
```

### 4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível no seu navegador em: [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Modelagem de Banco de Dados (`schema.prisma`)

A modelagem reflete as necessidades de um sistema focado no nicho de contabilidade:

```prisma
model Lead {
  id             String        @id @default(uuid())
  name           String
  company        String
  email          String
  phone          String
  status         String        @default("NEW") // "NEW", "CONTACTED", "PROPOSAL", "CLOSED"
  service        String        // Ex: "Troca de Contador", "Abertura de Empresa"
  origin         String        // Ex: "Google Ads DPG", "SEO Local"
  estimatedValue Float?        // Honorários mensais estimados
  notes          String?       // Escopo e observações do cliente
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  history        LeadHistory[]

  @@index([status])
  @@index([createdAt])
  @@map("leads")
}

model LeadHistory {
  id          String   @id @default(uuid())
  leadId      String
  type        String   // "CREATED", "STATUS_CHANGE", "NOTE_ADDED"
  description String
  createdAt   DateTime @default(now())

  lead        Lead     @relation(fields: [leadId], references: [id], onDelete: Cascade)

  @@index([leadId])
  @@map("lead_history")
}
```

---

## 🤝 Contato e Apresentação

Este projeto foi desenhado como demonstração de **Senioridade e Visão de Produto**.  
Se você faz parte do time de engenharia ou atração de talentos do **Grupo DPG**, sinta-se à vontade para explorar o código, testar as interações e simular o fluxo comercial.

Feito com dedicação e foco na transformação digital da contabilidade. 🚀
