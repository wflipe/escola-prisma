# Site Escola Prisma

Landing page institucional da **Escola Prisma** (Feira de Santana, BA), da Educação Infantil ao Ensino Médio.
Produção: <https://www.escolaprisma.net.br> (o domínio sem `www` redireciona para ele)

Código no GitHub, com deploy automático na **Vercel** (site estático: `astro build` → `dist/`). Cada PR gera um deploy de preview.

### Dados oficiais da escola

Mantenha estes dados **idênticos** no site, no Perfil da Empresa no Google e nas redes sociais:

- **Endereço:** Caminho 16 - Tomba, Feira de Santana - BA, CEP 44091-554
- **Coordenadas:** -12.2949, -38.9457 (Plus Code P343+2P)
- **WhatsApp:** (75) 99895-4848
- **Instagram:** [@escolaprisma_](https://www.instagram.com/escolaprisma_/) (com underline no final)
- **Site:** https://www.escolaprisma.net.br (domínio oficial na Vercel; `escolaprisma.com` é **outro** site, antigo)

## Stack

- [Astro 7](https://docs.astro.build) (site estático), com as integrações `@astrojs/mdx`, `@astrojs/sitemap` e `astro-compress`
- [Tailwind CSS 4](https://tailwindcss.com) via `@tailwindcss/vite`
- `sharp` para otimização de imagens (`astro:assets`)
- Node.js **>= 22.12**

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm install` | Instala as dependências |
| `npm run dev` | Servidor local em `localhost:4321` (para agentes: `astro dev --background`) |
| `npm run build` | Gera o site em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm run check` / `npm run lint` | `astro check` (tipos e diagnósticos) |
| `npm run format` | Prettier em todo o projeto |

## Estrutura

```text
public/
  assets/            logos e imagem de compartilhamento (og:image 1200x630)
  favicon*, robots.txt, verificação do Google Search Console
src/
  pages/index.astro  página única: monta as seções em ordem
  layouts/BaseLayout.astro   <head> (SEO, Open Graph, geo, JSON-LD), header, footer, WhatsApp
  components/
    layout/          TopBar, Header, MobileMenu, Footer, WhatsAppFloat
    sections/        Hero, EnrollmentBanner, ProblemSolution, Manifesto, ChristianValues,
                     DailyRoutine, Phases, Ecosystem, SocialProof, FAQ, SocialFeed, FinalCTA
    ui/              Button, Card, Badge, Icon, Container, Section
  content/           textos editáveis em JSON (hero, matrículas, fases, ecossistema, depoimentos, FAQs)
  data/escola.ts     dados oficiais da escola + gerador de links do WhatsApp
  types/content.ts   tipos dos JSON de conteúdo
  scripts/           menu mobile e botão "voltar ao topo" (TypeScript)
  assets/images/     fotos otimizadas pelo Astro (usar .webp)
  styles/globals.css tokens da marca (@theme do Tailwind) e estilos base
  utils/schema.ts    geradores de dados estruturados schema.org
docs/                documentação interna (plano, banner, WhatsApp, restauração)
arquivo/             relatórios do Lighthouse e imagens originais/não usadas — não vão para o site
Documentos/          PDFs institucionais (PPP etc.) — não vão para o site
```

> Só vai para o site publicado o que está em `public/` e o que algum componente importa de `src/`. As pastas `arquivo/` e `Documentos/` ficam só no GitHub e não afetam o desempenho do site.

## Identidade visual

Os tokens ficam em `src/styles/globals.css` (`@theme`):

| Token | Cor | Uso |
| --- | --- | --- |
| `--color-primary` | `#F67A21` | Laranja da marca, CTAs |
| `--color-secondary` | `#152E65` | Azul-marinho oficial, fundos escuros |
| `--color-accent` | `#F9B91A` | Dourado oficial, destaques |

Fontes (Google Fonts): **Bricolage Grotesque** (títulos), **Instrument Serif** (destaques em itálico), **Montserrat** (texto).

## Como editar conteúdo

- **Dados oficiais da escola** (endereço, CEP, telefones, WhatsApp, Instagram, coordenadas): `src/data/escola.ts`. É a fonte única, usada pelo rodapé e pelos dados estruturados (`src/utils/schema.ts`).
- **Textos das seções:** `src/content/**.json`, com os tipos em `src/types/content.ts`.
  - Hero: `src/content/site/hero.json` (`headlineHighlight` = palavra em itálico dourado).
  - **Banner de matrículas:** `src/content/site/matriculas.json` (`"ativo": false` esconde). Ver [docs/BANNER-MATRICULAS.md](docs/BANNER-MATRICULAS.md).
- **WhatsApp:** nunca escreva links `wa.me` à mão. Use `whatsappLink("assunto")` de `src/data/escola.ts` (ou o campo `whatsappAssunto` nos JSON). Ele gera "Olá! Vim pelo site da Escola Prisma e gostaria de <assunto>." Ver [docs/WHATSAPP-SAUDACAO.md](docs/WHATSAPP-SAUDACAO.md).
- **Vídeo da rotina:** `src/components/sections/DailyRoutine.astro` (embed do YouTube).
- **Scripts do navegador:** `src/scripts/*.ts`, importados no `BaseLayout` e empacotados pelo Astro.
- **Monitoramento (Umami + Clarity):** scripts no `BaseLayout`; cliques de conversão em `src/scripts/analytics.ts`, a partir dos atributos `data-ga4-event` e `data-ga4-location` dos botões. Ver [docs/MONITORAMENTO.md](docs/MONITORAMENTO.md).
- **Imagens:** colocar em `src/assets/images/` em `.webp` e usar o componente `<Image>` de `astro:assets`.

## Links externos usados

- Portal dos pais: `https://pais.escolaprisma.com/login`
- Grafite (sistema acadêmico): `https://grafiteweb.infocraft.com.br/prismafeira`
- Feed social: Curator.io
- Instagram `@escolaprisma_` · Facebook `prismafeiraVII`

## Documentação interna

- [docs/PLANO-DE-CORRECOES.md](docs/PLANO-DE-CORRECOES.md): correções feitas e pendentes
- [docs/BANNER-MATRICULAS.md](docs/BANNER-MATRICULAS.md): banner de matrículas (como editar e desligar)
- [docs/WHATSAPP-SAUDACAO.md](docs/WHATSAPP-SAUDACAO.md): mensagens do WhatsApp e saudação automática
- [docs/MONITORAMENTO.md](docs/MONITORAMENTO.md): monitoramento: Umami (visitas e cliques) e Clarity (mapas de calor e gravações)
- [docs/RESTAURACAO.md](docs/RESTAURACAO.md): **pontos de restauração**, como voltar a uma versão salva
- [arquivo/README.md](arquivo/README.md): o que está guardado em `arquivo/`

## Fluxo de trabalho

1. Criar uma branch a partir da `main`.
2. Editar → `npm run check` (deve dar 0 erros) → `npm run build`.
3. Commit + push → abrir PR → conferir o **deploy de preview** da Vercel.
4. Merge na `main` → a Vercel publica em produção.
5. Em marcos importantes, criar um ponto de restauração (tag), conforme [docs/RESTAURACAO.md](docs/RESTAURACAO.md).
