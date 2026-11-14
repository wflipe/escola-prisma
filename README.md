# Site Escola Prisma

Landing page institucional da **Escola Prisma** (Feira de Santana, BA), da Educação Infantil ao Ensino Médio.
Produção: <https://www.escolaprisma.net.br> (o domínio sem `www` redireciona para ele)

Código no GitHub ([wflipe/escola-prisma](https://github.com/wflipe/escola-prisma)), com deploy automático na **Vercel**, que publica o domínio oficial (site estático: `astro build` → `dist/`). Cada PR gera um deploy de preview.

> O repositório também está ligado ao **Netlify** (projeto `escola-prisma`), que gera um preview próprio em cada PR (`deploy-preview-N--escola-prisma.netlify.app`). O domínio oficial está na Vercel. Se o Netlify não for mais usado, dá para desconectá-lo no painel dele.

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
    layout/          EnrollmentStrip (faixa de matrículas), TopBar, Header, MobileMenu,
                     Footer, WhatsAppFloat
    sections/        Hero, EnrollmentBanner, ProblemSolution, Manifesto, ChristianValues,
                     DailyRoutine, Phases, Ecosystem, SocialProof, FAQ, SocialFeed, FinalCTA
    ui/              Button, Card, Badge, Icon, Container, Section
  content/           textos editáveis em JSON (hero, matrículas, fases, ecossistema, depoimentos, FAQs)
  data/escola.ts     dados oficiais da escola + gerador de links do WhatsApp
  types/content.ts   tipos dos JSON de conteúdo
  scripts/           menu mobile, botão "voltar ao topo" e eventos do Umami/Clarity (TypeScript)
  assets/images/     fotos otimizadas pelo Astro (usar .webp)
  styles/globals.css tokens da marca (@theme do Tailwind) e estilos base
  utils/schema.ts    geradores de dados estruturados schema.org
docs/                documentação interna (plano, SEO/GEO, banner, WhatsApp, monitoramento, restauração)
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
  - **Banner de matrículas e faixa do topo:** `src/content/site/matriculas.json` (`"ativo": false` esconde os dois; `faixaTopo.ativo` só a faixa; `textCurto` = texto do botão no celular). Ver [docs/BANNER-MATRICULAS.md](docs/BANNER-MATRICULAS.md).
- **WhatsApp:** nunca escreva links `wa.me` à mão. Use `whatsappLink("assunto")` de `src/data/escola.ts` (ou o campo `whatsappAssunto` nos JSON). Ele gera "Olá! Vim pelo site da Escola Prisma e gostaria de <assunto>." Ver [docs/WHATSAPP-SAUDACAO.md](docs/WHATSAPP-SAUDACAO.md).
- **Vídeo da rotina:** `VIDEO_ID` no topo de `src/components/sections/DailyRoutine.astro`. Mostra uma capa (imagem do YouTube + play laranja) e só carrega o player ao clicar: sem faixas pretas, sem nome do canal antes do play e ~1 MB a menos no carregamento.
- **Scripts do navegador:** `src/scripts/*.ts`, importados no `BaseLayout` e empacotados pelo Astro.
- **Monitoramento (Umami + Clarity):** scripts no `BaseLayout`; cliques de conversão em `src/scripts/analytics.ts`, a partir dos atributos `data-ga4-event` e `data-ga4-location` dos botões. Ver [docs/MONITORAMENTO.md](docs/MONITORAMENTO.md).
- **Perguntas frequentes:** `src/content/faqs/faqs.json` (13 perguntas; também viram schema `FAQPage`).
- **Título e descrição da página (Google):** `src/pages/index.astro`.
- **Resumo para IAs:** `public/llms.txt`, escrito à mão. Atualize quando mudar dados da escola.
- **Ano de fundação:** `anoFundacao` em `src/data/escola.ts` (vazio = não aparece no schema).
- **Imagens:** colocar em `src/assets/images/` em `.webp` e usar o componente `<Image>` de `astro:assets`.

> ⚠️ O domínio do site fica em **dois lugares**, que precisam ser iguais: `site` no `astro.config.mjs` e `escola.site` no `src/data/escola.ts`. Ver [docs/SEO-GEO.md](docs/SEO-GEO.md).

## Links externos usados

- Portal dos pais: `https://pais.escolaprisma.com/login`
- Grafite (sistema acadêmico): `https://grafiteweb.infocraft.com.br/prismafeira`
- Feed social: Curator.io
- Instagram `@escolaprisma_` · Facebook `prismafeiraVII`

## Documentação interna

- [CHANGELOG.md](CHANGELOG.md): histórico de versões (o que mudou em cada commit)
- [docs/PLANO-DE-CORRECOES.md](docs/PLANO-DE-CORRECOES.md): correções feitas e pendentes
- [docs/SEO-GEO.md](docs/SEO-GEO.md): domínio oficial, Google, IAs (`llms.txt`, schema, FAQ) e consistência de dados
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
5. Em marcos importantes, criar um ponto de restauração (tag), conforme [docs/RESTAURACAO.md](docs/RESTAURACAO.md), e registrar no [CHANGELOG.md](CHANGELOG.md).
