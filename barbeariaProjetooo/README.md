# Projeto Barbearia (Studio Feel)

Aplicação web (landing page + fluxo de agendamento) feita em **Next.js (App Router)** com **React** e **Tailwind CSS**, com componentes UI baseados em **Radix UI / shadcn**.

## Visão geral

A aplicação é uma página única com seções:

- **Início (Hero)**: chamada principal e CTAs.
- **Serviços**: lista de serviços com seleção (múltipla) e botão para ver todos.
- **Galeria**: grid com filtro por categoria + lightbox.
- **Agendar**: wizard em 3 etapas (serviços → data/horário → dados do cliente).
- **Meus Agendamentos**: lista e status dos agendamentos criados na sessão.
- **Rodapé**: links, contato e horários (placeholders).

## Stack / Dependências principais

- **Next.js** `^16.2.x`
- **React** `^19`
- **TypeScript** `5.7.3`
- **Tailwind CSS** `4.2.0` + `tailwind-merge`
- **Radix UI** (vários pacotes)
- **lucide-react** (ícones)
- **react-hook-form** + **zod** (instalados; úteis para validação/formulários)

## Como rodar o projeto

### Pré-requisitos

- Node.js (recomendado: versão atual LTS)
- Gerenciador de pacotes: **pnpm** (há `pnpm-lock.yaml`)

### Instalação

```bash
pnpm install
```

### Ambiente de desenvolvimento

```bash
pnpm dev
```

Acesse:

- `http://localhost:3000`

### Build / Produção

```bash
pnpm build
pnpm start
```

## Estrutura do projeto

- `app/`
  - `layout.tsx`: layout raiz, fontes (Google Fonts) e `metadata`.
  - `page.tsx`: página principal, compõe as seções e mantém o estado em memória.
  - `globals.css`: tema e tokens CSS + Tailwind.
- `components/`
  - `header.tsx`: navegação (desktop/mobile).
  - `hero.tsx`: seção inicial.
  - `services.tsx`: lista de serviços (inclui array `services`).
  - `gallery.tsx`: galeria com filtro + lightbox.
  - `booking.tsx`: fluxo de agendamento (wizard) e tipo `Appointment`.
  - `my-appointments.tsx`: lista/gerenciamento de agendamentos.
  - `footer.tsx`: rodapé.
  - `ui/`: componentes de UI reutilizáveis (estilo shadcn/radix).
- `lib/`
  - `utils.ts`: helper `cn()` para composição de classes (`clsx` + `tailwind-merge`).
- `public/`
  - ícones e placeholders.
  - `public/images/`: pasta para suas imagens.

## Fluxo de dados (como o app “funciona”)

- O estado vive em `app/page.tsx`:
  - `selectedServices`: serviços selecionados.
  - `appointments`: lista de agendamentos.
- `Services` e `Booking` alternam serviços via `handleToggleService`.
- `Booking` cria um agendamento (`Appointment`) e chama `onAddAppointment`.
- `MyAppointments` exibe agendamentos futuros/histórico e permite cancelar (troca `status` para `cancelado`).

### Importante: sem backend

Atualmente **não existe persistência** (banco/arquivo/localStorage) nem API real.

- O “submit” do agendamento em `components/booking.tsx` simula uma chamada (`setTimeout`).
- Ao recarregar a página, os agendamentos somem.

## Imagens e placeholders

Vários componentes usam caminhos como:

- `Hero`: `/images/hero-bg.jpg`
- `Services`: `/images/services/service-1.jpg` ...
- `Gallery`: `/images/gallery/cut-1.jpg` ...

Para exibir imagens reais, coloque os arquivos em `public/images/...` seguindo os mesmos caminhos.

## Configurações relevantes

- `next.config.mjs`
  - `typescript.ignoreBuildErrors: true`: o build **não falha** por erros de TypeScript.
  - `images.unoptimized: true`: imagens sem otimização do Next (bom para deploy estático simples).

## Scripts

- `pnpm dev`: desenvolvimento
- `pnpm build`: build
- `pnpm start`: executar build
- `pnpm lint`: eslint

## Onde personalizar

- **Textos / nome**: `components/*.tsx` e `app/layout.tsx`.
- **Serviços**: array `services` em `components/services.tsx` (nome, preço, duração, imagem).
- **Horários**: `timeSlots` em `components/booking.tsx`.
- **Contato/endereço**: `components/footer.tsx`.
