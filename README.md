# Site Escola Prisma

Landing page institucional da **Escola Prisma** (Feira de Santana, BA), da Educação Infantil ao Ensino Médio.
Produção: <https://www.escolaprisma.net.br> (o domínio sem `www` redireciona para ele)

Código no GitHub ([wflipe/escola-prisma](https://github.com/wflipe/escola-prisma)), com deploy automático na **Vercel**, que publica o domínio oficial. O site é estático (`astro build` gera as páginas em `dist/client/`); só o painel de edição (`/keystatic`) roda como função na Vercel. Cada PR gera um deploy de preview.

> O repositório também está ligado ao **Netlify** (projeto `escola-prisma`), que gera um preview próprio em cada PR (`deploy-preview-N--escola-prisma.netlify.app`), configurado em `netlify.toml` (publica `dist/client`). O painel `/keystatic` não funciona no Netlify, só na Vercel. O domínio oficial está na Vercel. Se o Netlify não for mais usado, dá para desconectá-lo no painel dele.

### Dados oficiais da escola

Mantenha estes dados **idênticos** no site, no Perfil da Empresa no Google e nas redes sociais:

- **Endereço:** Caminho 16 - Tomba, Feira de Santana - BA, CEP 44091-554
- **Coordenadas:** -12.29491, -38.94568 (Plus Code P343+2P; mesmo ponto do mapa do rodapé)
- **WhatsApp:** (75) 99895-4848
- **Instagram:** [@escolaprisma_](https://www.instagram.com/escolaprisma_/) (com underline no final)
- **Site:** https://www.escolaprisma.net.br (domínio oficial na Vercel; `escolaprisma.com` é **outro** site, antigo)

## Stack

- [Astro 7](https://docs.astro.build) (site estático), com as integrações `@astrojs/mdx`, `@astrojs/sitemap` e `astro-compress`
- Painel de edição [Keystatic](https://keystatic.com) (`@keystatic/core` + `@keystatic/astro`, com `@astrojs/react`) em `/keystatic`, e adapter `@astrojs/vercel` só para as rotas do painel. A home e a 404 continuam pré-renderizadas, sem React
- [Tailwind CSS 4](https://tailwindcss.com) via `@tailwindcss/vite`
- `sharp` para otimização de imagens (`astro:assets`)
- Node.js **24.x** (`engines` no `package.json` e `.nvmrc`; é a versão em que a Vercel roda o build e as funções)

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm install` | Instala as dependências |
| `npm run dev` | Servidor local em `localhost:4321` (agentes: ver [AGENTS.md](AGENTS.md)). Painel em `localhost:4321/keystatic`, gravando direto nos arquivos de `src/content/` |
| `npm run build` | Gera o site em `dist/client/` (páginas estáticas) e `.vercel/output/` (pacote da Vercel, com a função do painel) |
| `npm run preview` | Não funciona com o adapter da Vercel (o Astro recusa). Para conferir o build estático: `npx serve dist/client` |
| `npm run check` / `npm run lint` | `astro check` (tipos e diagnósticos) |
| `npm run format` | Prettier em todo o projeto |

## Estrutura

```text
public/
  assets/            logos e imagem de compartilhamento (og:image 1200x630)
  painel/            visual do painel /keystatic (painel.css: estilo editorial; fontes Inter e IBM Plex Mono)
  favicon*, robots.txt, verificação do Google Search Console
src/
  pages/index.astro  página única: monta as seções na ordem de content/site/secoes.json
  pages/404.astro    página de "não encontrada" (noindex; links do menu com "/#secao")
  pages/llms.txt.ts  gera /llms.txt (resumo para IAs) com os dados de escola.json e matriculas.json
                     (o Keystatic injeta /keystatic e /api/keystatic/*, que rodam sob demanda)
  middleware.ts      só no HTML de /keystatic*: acrescenta o <link> de public/painel/painel.css
                     (páginas pré-renderizadas e /api passam sem alteração)
  layouts/BaseLayout.astro   <head> (SEO, Open Graph, geo, JSON-LD), header, footer, WhatsApp
  components/
    layout/          EnrollmentStrip (faixa de matrículas), TopBar, Header, MobileMenu,
                     Footer, WhatsAppFloat
    sections/        Hero, EnrollmentBanner, ProblemSolution, Manifesto, ChristianValues,
                     DailyRoutine, Phases, Ecosystem, SocialProof, FAQ, SocialFeed, FinalCTA
    ui/              Button, Card, Badge, Icon, Container, Section
  content/           conteúdo editável em JSON: textos, dados da escola, SEO e seções da home
  data/escola.ts     lê content/site/escola.json + gerador de links do WhatsApp
  data/secoes.ts     seções ligadas e ordem (content/site/secoes.json; repetida vale a primeira)
  data/menu.ts       menu, portais, rodapé e botão flutuante (content/site/menu-rodape.json)
  data/nomes-secoes.ts  nome em português e âncora (#id) de cada seção (site e painel)
  types/content.ts   tipos dos JSON de conteúdo
  scripts/           menu mobile, botão "voltar ao topo" e eventos do Umami/Clarity/GTM (TypeScript)
  assets/images/     fotos otimizadas pelo Astro (.webp, .jpg, .png ou .avif; o painel grava aqui)
  styles/globals.css tokens da marca (@theme do Tailwind) e estilos base
  utils/schema.ts    dados estruturados schema.org (grafo School + WebSite + WebPage, e FAQPage)
  utils/titulo.ts    título com trecho em destaque e quebra de linha (campos titulo/tituloDestaque)
  utils/imagens.ts   nome de arquivo do JSON → imagem de assets/images (astro:assets); falha o build se não existir
  utils/arquivos.ts  confere no build que o og:image do seo.json existe em public/
  utils/html.ts      escape de texto que mantém "&" solto (HTML idêntico ao anterior)
keystatic.config.ts  telas do painel /keystatic: cada uma edita um JSON de src/content/
vercel.json          cabeçalhos de segurança e de cache na Vercel (CSP em modo Report-Only; noindex e sem cache no painel)
netlify.toml         build dos previews do Netlify (publica dist/client)
docs/                documentação interna (lista em "Documentação interna", abaixo)
AGENTS.md            regras do projeto para agentes de IA (CLAUDE.md aponta para ele)
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

Fontes: **Bricolage Grotesque** (títulos), **Instrument Serif** (destaques em itálico), **Montserrat** (texto). Configuradas em `fonts` no `astro.config.mjs` (API de fontes do Astro): baixadas do Google Fonts no build e servidas pelo próprio site. Para trocar pesos ou famílias, mude lá; os nomes usados no CSS são `--font-heading`, `--font-serif` e `--font-body` (`src/styles/globals.css`).

## Como editar conteúdo

- **Painel de edição (`/keystatic`):** no computador, `npm run dev` e abra `localhost:4321/keystatic`; cada "Save" grava o JSON correspondente em `src/content/`. Todo texto visível do site (e os textos alternativos de fotos e vídeo) é editável por ele, em 18 telas (lista e arquivos em [docs/PLANO-PAINEL-ADMIN.md](docs/PLANO-PAINEL-ADMIN.md), seção 3; configuração em `keystatic.config.ts`):
  - **Topo da página:** Topo (Hero), Matrículas.
  - **Seções da página:** Seções: ordem e visibilidade, A Escola (proposta), Manifesto, Valores cristãos, Rotina e vídeo, Fases de ensino, Diferenciais, Famílias: por que a Prisma, Famílias: depoimentos, Dúvidas (perguntas frequentes), Instagram, Chamada final (visita).
  - **Site todo:** Menu e rodapé, Página não encontrada (404), Dados da escola, SEO e compartilhamento.

  No site publicado (`www.escolaprisma.net.br/keystatic`) o painel grava no GitHub: cada "Save" vira um commit na `main` e a Vercel publica em 1–2 minutos. O login usa o GitHub App `escola-prisma-painel` e 4 variáveis de ambiente na Vercel; como refazer, trocar o segredo e resolver erros de login está na Etapa 3 de [docs/PLANO-PAINEL-ADMIN.md](docs/PLANO-PAINEL-ADMIN.md). Manual de quem edita: [docs/PAINEL-ADMIN.md](docs/PAINEL-ADMIN.md). O painel grava os JSON no formato `JSON.stringify(dados, null, 2)`, omite campos de texto vazios e **apaga chaves que não estão na tela** (para manter uma chave fora do painel, use `fields.ignored()`); edições à mão devem seguir o mesmo formato para não gerar diferenças à toa. O painel fica fora do Google (`robots.txt`, `X-Robots-Tag: noindex` e fora do sitemap).

  **Visual do painel (estilo editorial):** o Keystatic não tem API de tema. O visual entra por `public/painel/painel.css`, que só troca variáveis CSS do Keystar UI: `--kui-color-scale-indigo*` (destaque: botão Save marrom `#3b281d`, links cobre `#a84d16`), `--kui-color-scale-slate*` (neutros quentes: branco, creme `#f7f4f1`, grafite) e `--kui-typography-font-family-base` (Inter), com tema claro e escuro (tons de café). Nomes dos grupos em IBM Plex Mono maiúsculo. As fontes ficam em `public/painel/` (a CSP do painel só aceita fontes do próprio domínio). As contas de contraste estão no topo do `painel.css`: refaça se mudar uma cor; o `src/middleware.ts` coloca esse CSS só nas páginas `/keystatic*`. Ao atualizar o `@keystatic/core`, confira se essas variáveis ainda existem (se sumirem, o painel volta ao visual padrão, sem quebrar). Em `keystatic.config.ts`: interface em `pt-BR` (`locale`), logo no menu (`ui.brand.mark`), um bloco "Onde aparece / Ver no site" no início de cada tela (campo `verNoSite`, um `fields.empty()` que não grava nada no JSON) e `layout` (colunas) nos grupos. ⚠️ O Tailwind do site lê `keystatic.config.ts`: não escreva ali estilos inline com valores que tenham nome de classe do Tailwind (ex.: a posição absoluta ou o display em bloco), senão a classe entra no CSS do site (o Tailwind também lê o README); use classes de `painel.css`.
- **Dados oficiais da escola** (endereço, CEP, telefones, WhatsApp, Instagram, coordenadas, slogan do rodapé): `src/content/site/escola.json` (descrição dos campos em `EscolaData`, `src/types/content.ts`; lido por `src/data/escola.ts`). É a fonte única, usada pelo rodapé, menu, seção Instagram e dados estruturados (`src/utils/schema.ts`). Latitude e longitude ficam como **número** no JSON; o painel edita como texto (4 a 7 casas, sem arredondar).
- **Textos das seções:** `src/content/**.json`, com os tipos em `src/types/content.ts`. Todo JSON tem um objeto na raiz; listas ficam em `{ "items": [...] }` ou numa chave própria (`cartoes`, `itens`, `menu`). Títulos usam `titulo` + `tituloDestaque` (trecho em itálico colorido; quebra de linha no título vira `<br />`, ver `src/utils/titulo.ts`). As seções sem JSON próprio antes do painel ganharam um arquivo `src/content/site/secao-*.json`.
  - **Seções da página:** `src/content/site/secoes.json` liga/desliga (`"ativo"`) e ordena as seções depois do Hero e do banner de matrículas, que ficam fixos no topo. Seção repetida vale só na primeira posição; seção ausente da lista fica escondida (`src/data/secoes.ts`). O item do menu de uma seção desligada some sozinho (topo e celular).
  - **Menu, barra azul, rodapé e botão flutuante:** `src/content/site/menu-rodape.json` (cada item do menu aponta para uma seção, não para um `#id` escrito à mão).
  - **Hero:** `src/content/site/hero.json` (`headlineHighlight` = palavra em itálico dourado; `cartoes` = os 3 cartões de foto, com o **nome do arquivo** da foto em `src/assets/images/`). Foto nova pelo painel: .webp quadrada de ~1024 px (.jpg, .png e .avif também; gif/heic são recusados); as fotos que já existem mantêm o nome, e a nova entra com o nome enviado + um sufixo de data/hora (nunca substitui outra foto); ao trocar, o painel apaga o arquivo antigo. Se o arquivo não existir, o build falha dizendo qual cartão.
  - **Banner de matrículas e faixa do topo:** `src/content/site/matriculas.json` (`"ativo": false` esconde os dois; `faixaTopo.ativo` só a faixa; `textCurto` = texto do botão no celular; `ctaSecundario.mostrar: false` esconde o botão secundário, e a chave só aparece quando ele está escondido). Ver [docs/BANNER-MATRICULAS.md](docs/BANNER-MATRICULAS.md).
  - **Página 404:** `src/content/site/pagina-404.json`.
- **WhatsApp:** nunca escreva links `wa.me` à mão. Use `whatsappLink("assunto")` de `src/data/escola.ts` com o assunto vindo de um campo `whatsappAssunto` dos JSON (nenhum assunto fica mais fixo nos componentes). Ele gera "Olá! Vim pelo site da Escola Prisma e gostaria de <assunto>." Ver [docs/WHATSAPP-SAUDACAO.md](docs/WHATSAPP-SAUDACAO.md).
- **Vídeo da rotina:** `video.youtubeId` em `src/content/site/secao-rotina.json` (tela "Rotina e vídeo"). Mostra uma capa (imagem do YouTube + play laranja) e só carrega o player ao clicar: sem faixas pretas, sem nome do canal antes do play e ~1 MB a menos no carregamento.
- **Scripts do navegador:** `src/scripts/*.ts`, importados no `BaseLayout` e empacotados pelo Astro.
- **Monitoramento (Umami + Google Tag Manager `GTM-NRQ8DB4L`, que carrega GA4 `G-B7C6WH3HK9` e Clarity):** scripts no `BaseLayout` (só no domínio oficial); o Clarity não está mais no código, só no GTM; cliques de conversão em `src/scripts/analytics.ts`, a partir dos atributos `data-ga4-event` e `data-ga4-location` dos botões, enviados também ao `dataLayer`. Ver [docs/MONITORAMENTO.md](docs/MONITORAMENTO.md).
- **Estilo dos textos:** frases diretas, maiúscula só no início dos títulos, sem emoji e sem frases de efeito repetindo o que o card já disse. Não invente dados: tudo o que aparece no site deve bater com `src/content/site/escola.json` e com o que a escola confirmou.
- **Depoimentos:** textos em `src/content/testimonials/testimonials.json`. O bloco está oculto; para mostrar, `"mostrarDepoimentos": true` em `src/content/site/secoes.json` (só com depoimentos reais e autorizados).
- **Perguntas frequentes:** `src/content/faqs/faqs.json` (13 perguntas; também viram schema `FAQPage`, que só sai quando a seção `FAQ` está ligada e tem pelo menos uma pergunta; o painel exige no mínimo uma).
- **Título, descrição, imagem de compartilhamento, descrição da escola e temas para o Google/IAs:** `src/content/site/seo.json`. O `ogImage` é um caminho em `public/`; se o arquivo não existir, o build falha com a mensagem do campo.
- **Resumo para IAs:** `/llms.txt`, gerado no build por `src/pages/llms.txt.ts` com os dados de `escola.json` e `matriculas.json` (o parágrafo de apresentação e as listas de etapas e diferenciais ficam no próprio arquivo).
- **Ano de fundação:** `anoFundacao` em `src/content/site/escola.json` (ausente ou vazio = não aparece no schema; o painel apaga a chave quando o campo fica vazio).
- **Imagens:** colocar em `src/assets/images/` em `.webp` e usar o componente `<Image>` de `astro:assets` (imagens escolhidas no painel passam por `src/utils/imagens.ts`).

> ⚠️ O domínio do site fica em **dois lugares**, que precisam ser iguais: `site` no `astro.config.mjs` e `site` no `src/content/site/escola.json`. O `site` do JSON fica fora do painel (o painel preserva o valor ao salvar) e o build falha se os dois forem diferentes. Ver [docs/SEO-GEO.md](docs/SEO-GEO.md).

> ⚠️ **Windows:** rode `npm run dev`/`npm run build` com o caminho do projeto com a letra do disco em **maiúscula** (`D:\...`; no Git Bash, `cd /D/...`). Com `d:` minúsculo o build sai sem CSS e o adapter da Vercel cria em `.vercel/` links que apontam para a própria pasta. Por isso o `astro.config.mjs` manda o `npm run dev` ignorar `.vercel/**` (`vite.server.watch.ignored`); se a pasta `.vercel/` ficar estranha, apague-a e rode o build de novo.

## Links externos usados

- Portal dos pais: `https://pais.escolaprisma.com/login` (links dos portais editáveis em "Menu e rodapé")
- Grafite (sistema acadêmico): `https://grafiteweb.infocraft.com.br/prismafeira`
- Feed social: Curator.io
- Instagram `@escolaprisma_` · Facebook `prismafeiraVII`

## Documentação interna

**Para quem edita o conteúdo**
- [docs/PAINEL-ADMIN.md](docs/PAINEL-ADMIN.md): manual do painel `/keystatic` (entrar, editar, salvar, fotos, desfazer)
- [docs/BANNER-MATRICULAS.md](docs/BANNER-MATRICULAS.md): banner de matrículas (como editar e desligar)
- [docs/WHATSAPP-SAUDACAO.md](docs/WHATSAPP-SAUDACAO.md): mensagens do WhatsApp e saudação automática

**Técnico (manutenção do site)**
- [docs/PLANO-PAINEL-ADMIN.md](docs/PLANO-PAINEL-ADMIN.md): como o painel foi montado, GitHub App, variáveis na Vercel, troca do segredo e erros de login
- [docs/SEO-GEO.md](docs/SEO-GEO.md): domínio oficial, Google, IAs (`llms.txt`, schema, FAQ) e consistência de dados
- [docs/MONITORAMENTO.md](docs/MONITORAMENTO.md): Umami (visitas e cliques), Clarity (mapas de calor e gravações) e Google Tag Manager/GA4
- [docs/RESTAURACAO.md](docs/RESTAURACAO.md): **pontos de restauração**, como voltar a uma versão salva

**Histórico**
- [CHANGELOG.md](CHANGELOG.md): o que mudou em cada versão
- [docs/PLANO-DE-CORRECOES.md](docs/PLANO-DE-CORRECOES.md): plano de correções de 13/11/2026 (concluído)
- [docs/AUDITORIA-SEO-2026-11.md](docs/AUDITORIA-SEO-2026-11.md): auditoria de SEO de 14/11/2026 (notas, achados, o que foi corrigido e o que falta)
- [arquivo/README.md](arquivo/README.md): o que está guardado em `arquivo/`

## Fluxo de trabalho

1. Criar uma branch a partir da `main`.
2. Editar → `npm run check` (deve dar 0 erros) → `npm run build`.
3. Commit + push → abrir PR → conferir o **deploy de preview** da Vercel.
4. Merge na `main` → a Vercel publica em produção.
5. Em marcos importantes, criar um ponto de restauração (tag), conforme [docs/RESTAURACAO.md](docs/RESTAURACAO.md), e registrar no [CHANGELOG.md](CHANGELOG.md).
