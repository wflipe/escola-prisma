# Histórico de versões

Mudanças relevantes do site, da mais recente para a mais antiga.
Pontos de restauração (tags `restauracao/*`) estão em [docs/RESTAURACAO.md](docs/RESTAURACAO.md).

## 16/11/2026 · branch `feat/painel-ptbr`

- **Painel 100% em português:** `public/painel/traducao.js` (colocado em `/keystatic*` pelo `src/middleware.ts`) troca os textos que o Keystatic deixa fixos em inglês: Salvar, Desfazer alterações, Concluir, Remover, Editar item, Adicionar item, Escolher arquivo, Não salvo, menus da conta e avisos. Só troca textos idênticos ao dicionário e nunca mexe em campos de digitação; não muda nada do que é gravado. Acentos escritos como `ã` no script (o navegador lia o arquivo com a codificação errada).
- Manual (`docs/PAINEL-ADMIN.md`) com os nomes dos botões em português.
- Novo plano [docs/PLANO-PAINEL-DADOS.md](docs/PLANO-PAINEL-DADOS.md): números do Umami, Google Analytics, Search Console e Clarity dentro do painel (aguardando as chaves de acesso).

## 16/11/2026 · [PR #12](https://github.com/wflipe/escola-prisma/pull/12) · branch `docs/organiza-projeto`

- **Organização do projeto e da documentação:** README com a lista de documentos por público (quem edita, técnico, histórico) e a seção do visual do painel atualizada; `AGENTS.md` com as regras do projeto para agentes (Windows, servidor local, formato dos JSON, Tailwind, segredos, fluxo de publicação); `CLAUDE.md` passa a importar o `AGENTS.md`; pendências de segurança do GitHub App listadas em `docs/PLANO-PAINEL-ADMIN.md`; `.vscode/settings.json` (preferência pessoal) fora do Git; branches locais já publicadas apagadas. Nenhuma mudança no site nem no painel.

## 16/11/2026 · [PR #11](https://github.com/wflipe/escola-prisma/pull/11) · branch `feat/painel-estilo-editorial`

- **Novo estilo do painel `/keystatic` (editorial):** fundo branco, texto preto em Inter com espaçamento justo, cartões creme (`#f7f4f1`) sem sombra e com cantos de 16 px, botão **Save** marrom-escuro (`#3b281d`, 13,9:1) em pílula, links cobre (`#a84d16`, 5,1:1 sobre o creme), nomes de grupos e a etiqueta "Onde aparece" em IBM Plex Mono maiúsculo e um disco terracota decorativo na caixa "Onde aparece". Tema escuro em tons de café (fundo `#211006`, botão `#a84d16` com 5,6:1, links `#f2a66b` com 8,5:1).
- Fontes Inter e IBM Plex Mono (licença SIL OFL, pacotes `@fontsource` 5.3.0) em `public/painel/`, porque a CSP do painel só aceita fontes do próprio domínio. A Bricolage Grotesque saiu do painel; no site nada muda.

## 16/11/2026 · [PR #10](https://github.com/wflipe/escola-prisma/pull/10) · branch `feat/painel-visual`

- **Visual do painel `/keystatic` com a marca:** cor de destaque laranja (`#c2410c`, laranja da marca escurecido para o texto branco do botão passar no contraste AA: 5,2:1), cinzas puxados para o azul-marinho, títulos na fonte Bricolage Grotesque (a mesma do site), nome da tela em azul-marinho, grupos de campos em cartões e formulário mais estreito (800 px). Tema claro e escuro. Arquivo `public/painel/painel.css`, colocado só nas páginas do painel por `src/middleware.ts` (novo); o CSS só troca variáveis do Keystar UI, sem depender de classes geradas.
- **Organização das telas** (`keystatic.config.ts`): logo da escola no topo do menu; interface do Keystatic em português onde ele tem tradução (`locale: 'pt-BR'`: "Painel", "Adicionar", "Pesquisar"…; "Save", "Reset", "Done" e "Edit item" continuam em inglês porque o Keystatic não traduz); no início de cada uma das 18 telas, uma caixa "onde aparece" com o link **Ver no site ↗** para a seção (não grava nada no JSON); campos curtos lado a lado no computador (texto do botão e texto curto, chamadas da faixa, UF/CEP/País, latitude/longitude, telefones, WhatsApp, Instagram, portais, ícone e título dos cartões, os 3 cartões de foto do Topo); ajudas mais curtas (detalhes no manual).
- **O formato dos JSON de `src/content` não mudou:** ida e volta nas 18 telas (alterar, salvar, desfazer, salvar) deixa os 18 arquivos iguais byte a byte ao commit; fotos intactas. `index.html`, `404.html` e `llms.txt` saem idênticos byte a byte aos da `main`; sitemaps iguais tirando o `lastmod`; rotas da Vercel (`config.json`) idênticas.
- Docs: manual (botões em português, caixa "Ver no site", campos lado a lado) e README (estrutura e como o visual do painel funciona).

## 16/11/2026 · [PR #9](https://github.com/wflipe/escola-prisma/pull/9) · branch `chore/atualiza-astro`

- **Atualização de segurança:** `astro` 7.2.2 → 7.4.12 (falha crítica em `astro <=7.4.6`), `@astrojs/mdx` 7.0.5 → 7.0.8, `@astrojs/sitemap` 3.7.3 → 3.7.5, `sharp` 0.35.3 → 0.35.5; `@astrojs/react` 7.1.9, `@astrojs/vercel` 11.0.22 e `@astrojs/check` 0.9.12 já estavam na última versão. `npm audit fix` (sem `--force`) atualizou dependências internas (`vite` 8.3.8, `undici` 8.12.4, `devalue` 6.0.3, `js-yaml` 4.3.2, `source-map-js` 1.2.2).
- `npm audit`: de 16 falhas (1 crítica, 13 altas, 2 moderadas) para 10 (8 altas, 2 moderadas). As que sobram não têm correção sem subir major ou trocar de pacote: `astro-compress` (fixa `sharp` 0.35.3, `svgo` 4.0.2 e `deepmerge-ts` 7; não há versão nova), `@astrojs/vercel` (`path-to-regexp` 6.1.0 via `@vercel/routing-utils`) e `@keystatic/core` (`minimatch`); todas rodam só no build ou no painel.
- **Node 24 fixo:** `engines` passou de `>=22.12.0` para `24.x` e foi criado o `.nvmrc` (`24`). A Vercel avisava que `>=22.12` fazia o build rodar em Node 26, enquanto as funções rodam em Node 24.
- O HTML da home e da 404 só muda em duas coisas: a meta `generator` (`Astro v7.4.12`) e a saída de `font-stretch:100%` dos `@font-face` (é o valor padrão, nada muda na tela). `llms.txt` e sitemaps saem iguais byte a byte; as rotas da Vercel (`config.json`) também.

## 16/11/2026 · branch `docs/painel-etapa3`

- **Painel ligado ao GitHub (Etapa 3):** GitHub App `escola-prisma-painel` e 4 variáveis na Vercel; login em produção funcionando desde 15/11/2026. Primeira edição feita pelo painel: selo do topo sem "· Vestibular" (commit `07ba0a0`).
- Docs: passo a passo do GitHub App e das variáveis (o assistente do Keystatic só roda no computador; a variável `PUBLIC_` tem de ser do tipo Config na Vercel), troca do client secret e tabela de erros de login em [docs/PLANO-PAINEL-ADMIN.md](docs/PLANO-PAINEL-ADMIN.md); manual atualizado com a tela real de login; tag `restauracao/2026-11-15-antes-do-painel` enviada ao GitHub.

## 15/11/2026 · [PR #7](https://github.com/wflipe/escola-prisma/pull/7) · branch `feat/painel-admin` · tag `restauracao/2026-11-15-antes-do-painel`

- **Painel de edição em `/keystatic`** (Keystatic, [docs/PLANO-PAINEL-ADMIN.md](docs/PLANO-PAINEL-ADMIN.md)): 18 telas em `keystatic.config.ts`, cada uma editando um JSON de `src/content/`. Todo texto visível do site, os assuntos das mensagens do WhatsApp, as fotos do Hero, a ordem e a visibilidade das seções, o menu, o rodapé, a página 404, os dados da escola e o SEO saíram do código para esses JSON. Manual para quem edita: [docs/PAINEL-ADMIN.md](docs/PAINEL-ADMIN.md). Ligado ao GitHub em 15/11/2026 (Etapa 3; ver a entrada de 16/11).
- O HTML da home e o sitemap continuam iguais aos da `main`; o `llms.txt` também (byte a byte).
- Correções da revisão do painel:
  - **Fotos:** a extensão é lida sem diferenciar maiúsculas (`.JPG` não quebra mais o build, `src/utils/imagens.ts`); foto nova enviada pelo painel ganha nome único (nome original sem `#`, `%`, `?` + sufixo de data/hora + extensão minúscula), então não substitui mais outra foto de mesmo nome; gif e heic são recusados no envio, com aviso.
  - **Coordenadas:** `-12.29000` era gravado como `-12.29` e depois a própria tela não salvava mais; agora o painel relê com 5 casas e aceita de 5 a 7 casas.
  - **`llms.txt` gerado no build** (`src/pages/llms.txt.ts`) a partir de `escola.json` e `matriculas.json`, em vez de escrito à mão em `public/`.
  - **Link da faixa de matrículas** só aceita `/`, `#` ou `https://` (bloqueia `javascript:`).
  - **Listas vazias** não geram bloco vazio: linha de indicadores do Hero, lista de etapas do banner, menu (some a lista; o botão do menu do celular fica) e `knowsAbout` do schema.
  - Limites de cada lista no painel alinhados com a ajuda e o layout (indicadores do Hero até 3; etapas de matrícula 1 a 6; depoimentos 1 a 6; temas 1 a 20); as cores dos cartões de A Escola e Valores se repetem a partir do 4º cartão.
  - Identificador (`id`) dos depoimentos saiu da tela (não é usado no site); o valor que já existe nos JSON é mantido.
  - **Página 404:** os links do menu passam a ser `/#proposta`, `/#etapas`… (antes `#proposta`, que não existe nessa página). Na home continuam `#proposta`.
- Docs: plano, manual, [docs/SEO-GEO.md](docs/SEO-GEO.md) (`llms.txt`), [docs/WHATSAPP-SAUDACAO.md](docs/WHATSAPP-SAUDACAO.md) (assuntos vêm do painel) e [docs/RESTAURACAO.md](docs/RESTAURACAO.md) (tag nova).

## 15/11/2026 · [PR #5](https://github.com/wflipe/escola-prisma/pull/5) · branch `fix/clarity-via-gtm`

- **Microsoft Clarity removido do código** (`BaseLayout`): passou a ser carregado só pelo Google Tag Manager (tag "Microsoft Clarity - Official"), que já tinha o mesmo projeto `zda9hbje8t`. Evita gravar cada sessão em dobro. Os eventos de clique do `analytics.ts` continuam indo para o Clarity.
- Docs: tags publicadas no contêiner `GTM-NRQ8DB4L` (GA4 `G-B7C6WH3HK9` + Clarity).

## 15/11/2026 · [PR #4](https://github.com/wflipe/escola-prisma/pull/4) · branch `fix/gtm-novo-conteiner`

- **Contêiner do Google Tag Manager trocado:** `GTM-N4T2LBTX` → `GTM-NRQ8DB4L` (código novo fornecido pelo Google Analytics). Continua uma única tag por página, só no domínio oficial. Ver [docs/MONITORAMENTO.md](docs/MONITORAMENTO.md).

## 14/11/2026 · [PR #3](https://github.com/wflipe/escola-prisma/pull/3) · branch `fix/seo-auditoria-tecnica` · tag `restauracao/2026-11-14-seo-auditoria-tecnica`

Correções de código da [auditoria de SEO de 14/11/2026](docs/AUDITORIA-SEO-2026-11.md):
- **Schema em grafo único** (`@graph`): `School` + `WebSite` + `WebPage` ligados por `@id`; `url` com a barra final (igual à canonical); logo como `ImageObject` quadrado (512×512); `availableLanguage: pt-BR`. Função nova: `siteGraphSchema()` em `src/utils/schema.ts`.
- **Coordenadas com 5 casas decimais** (`-12.29491, -38.94568`, as mesmas do mapa do rodapé), também nas metas `geo.position`/`ICBM`, que agora leem `escola.ts`.
- **Fontes servidas pelo próprio site** (API de fontes do Astro, `astro.config.mjs`): sem `fonts.googleapis.com` no carregamento, fallback com métricas ajustadas e preload da fonte dos títulos.
- **Hero:** as três fotos carregam na hora (`loading="eager"`; a primeira com `fetchpriority="high"`) e com versão 2x para telas retina.
- **Feed do Instagram:** altura reservada (o conteúdo abaixo não "pula" quando o feed aparece) e `rel="nofollow"` no link do Curator.
- **Página 404 própria** (`src/pages/404.astro`, `noindex`), com botões para o início e o WhatsApp.
- **`vercel.json`:** cabeçalhos de segurança (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`) e CSP em modo **Report-Only** (só avisa no console, não bloqueia nada); cache de 1 dia para `/assets/*` (antes: 1 ano "immutable").
- Open Graph com `og:locale`, `og:site_name` e dimensões/descrição da imagem.
- Botões "Saber mais" de cada fase com `aria-label` próprio.
- Telefone fixo do topo e do menu do celular lido de `escola.ts` (antes estava escrito à mão).
- Sitemap com `lastmod`; `prefetch` removido (inútil em página única).
- JSON-LD escapa `<` (proteção caso um texto da FAQ contenha `</script>`).
- **Tag do Google (GTM `GTM-N4T2LBTX`)** no início do `<head>`, só no domínio oficial; cliques de conversão também enviados ao `dataLayer`; CSP libera GTM/GA4. Ver [docs/MONITORAMENTO.md](docs/MONITORAMENTO.md).

## 14/11/2026 · [PR #2](https://github.com/wflipe/escola-prisma/pull/2) · branch `fix/ocultar-depoimentos`

- Bloco "O que dizem as famílias" oculto até a escola confirmar depoimentos reais e autorizados. Para voltar a mostrar: `MOSTRAR_DEPOIMENTOS = true` em `src/components/sections/SocialProof.astro`. Os textos continuam em `src/content/testimonials/testimonials.json`.

## 13/11/2026 · [PR #1](https://github.com/wflipe/escola-prisma/pull/1) · publicado na `main` · tag `restauracao/2026-11-13-publicacao-textos-revisados`

### `dcd478f`: textos do site revisados
- Textos das seções e da FAQ reescritos para soar menos genéricos: sem contrastes do tipo "não é X, é Y", sem frase de efeito repetindo o card, sem listas de três forçadas, títulos com maiúscula só no início e sem emoji no texto final. Os fatos não mudaram.
- Depoimentos: "Por que escolher a Prisma" e "O que dizem as famílias" (o título "seu filho não é apenas mais um" ficou só no Manifesto).
- Rodapé: "Nossa Localização" → "Onde estamos".
- Mantidos de propósito: título do Hero, botões, menu, slogan, "Avançar de fase é evoluir." e o texto dos depoimentos (citações).

### Faixa no topo, capa do vídeo e documentação
- Botão principal do banner no mesmo padrão da faixa: "Garanta a vaga do seu filho" no computador e "Garanta a vaga" no celular; botões do banner sem seta (`cta.textCurto`).
- **Faixa "Matrículas 2027 abertas" no topo**, acima da barra azul (computador e celular), levando ao banner. Texto em `matriculas.json` → `faixaTopo`; some junto com o banner. Evento `click_faixa_matriculas`.
- **Vídeo da rotina com capa:** imagem do vídeo + botão de play laranja; o player do YouTube (`youtube-nocookie`, `rel=0`) só carrega no clique. Remove as faixas pretas (caixa em 16:9) e o nome do canal antes do play, e economiza cerca de 1 MB no carregamento. Evento `play_video_rotina` no Umami/Clarity.
- Documentação: `CHANGELOG.md`, `docs/SEO-GEO.md` e atualizações no README, no plano e na restauração.

### `1cfd751`: SEO/GEO, domínio .net.br, Umami e Clarity
- **Domínio oficial corrigido para `www.escolaprisma.net.br`** (canonical, `og:url`, `og:image` absoluto, sitemap, schema). Antes apontava para `escolaprisma.com`, que é outro site.
- `public/llms.txt` com os dados oficiais da escola para assistentes de IA.
- Título e descrição com "escola particular em Feira de Santana".
- Schema `School` com `knowsAbout` e `foundingDate` opcional (`escola.anoFundacao`, vazio até confirmar).
- FAQ: 4 novas perguntas (etapas, endereço, material didático, ENEM/UEFS); total de 13.
- Monitoramento: Umami e Microsoft Clarity, só no domínio oficial, com eventos de clique (`src/scripts/analytics.ts`).
- Celular: botões e topo quebram linha em telas estreitas (sem transbordar de 280px em diante).

### `4d42f2b`: banner de matrículas, WhatsApp padronizado e correções · tag `restauracao/2026-11-13-correcoes-e-banner`
- Banner "Matrículas 2027 abertas" após o Hero (horizontal no computador, vertical no celular).
- Dados oficiais centralizados em `src/data/escola.ts`; endereço Caminho 16 - Tomba, CEP 44091-554.
- `whatsappLink()`: todos os links com "Olá! Vim pelo site da Escola Prisma e gostaria de …".
- Hero lê `hero.json`; novo vídeo da rotina (`qYuossXmZfc`); `@escolaprisma_` corrigido.
- Schema `School` + `FAQPage`; `courseSchema` removido.
- Scripts mortos/duplicados removidos; `@astrojs/check` adicionado; 0 erros de tipo.
- Relatórios e imagens sem uso movidos para `arquivo/`.

## Antes de 13/11/2026 · `main` · tag `restauracao/2026-11-13-antes-das-correcoes`

- `83f8a12`: identidade visual, favicons, `<picture>`, limpeza de arquivos.
- `4045357`: verificação do Google Search Console.
- `069a429`: otimizações de performance (Lighthouse).
- `c36d91b`: seção Valores Cristãos.
