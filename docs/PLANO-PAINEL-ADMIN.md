# Plano — Painel de edição do site (ADM)

Criado em 15/11/2026. Status: **no ar desde 15/11/2026** ([PR #7](https://github.com/wflipe/escola-prisma/pull/7)). Etapas 1 a 5 concluídas; o login em produção funciona com o GitHub App `escola-prisma-painel` (primeira edição real pelo painel: commit `07ba0a0`). Em 16/11/2026: visual e organização das telas ([PR #10](https://github.com/wflipe/escola-prisma/pull/10)) e estilo editorial ([PR #11](https://github.com/wflipe/escola-prisma/pull/11)). Falta o treino com o ADM e a rotina de segurança do GitHub App (ver "Pendências de segurança", abaixo).

### Pendências de segurança (16/11/2026)

- [ ] No GitHub App `escola-prisma-painel`: instalação só no repositório `escola-prisma` (**Only select repositories**), não em todos.
- [ ] Apagar a *private key* do app no GitHub e o arquivo `.pem` baixado (o Keystatic não usa).
- [ ] Gerar um novo *client secret* (o atual apareceu num print), trocar `KEYSTATIC_GITHUB_CLIENT_SECRET` na Vercel e fazer **Redeploy** (passo a passo em "Trocar o client secret", abaixo).

Objetivo: um painel compacto, em `www.escolaprisma.net.br/keystatic`, onde o administrador edita **tudo** que aparece no site (textos, botões, ligar/desligar seções, imagens, dados de contato, SEO) sem mexer em código. Cada "Salvar" vira um commit no GitHub e a Vercel publica em 1–2 minutos, como já acontece hoje com os PRs.

## 1. Como o site funciona hoje (e por que isso facilita)

- Página única (`src/pages/index.astro`) que monta as seções em ordem.
- Todo o texto já está em JSON: `src/content/site/{hero,matriculas,phases,ecosystem,why-items}.json`, `src/content/faqs/faqs.json`, `src/content/testimonials/testimonials.json`.
- Dados oficiais (endereço, telefones, Instagram) em `src/data/escola.ts`.
- Deploy automático: commit na `main` → build na Vercel → site no ar. Histórico e restauração via Git (`docs/RESTAURACAO.md`).

Ou seja: o painel não precisa de banco de dados. Basta uma interface que edite esses arquivos no GitHub. O site continua estático, rápido e com o SEO já auditado.

## 2. Ferramenta escolhida: Keystatic (modo GitHub)

| Critério | Keystatic (recomendado) | Pages CMS | Sveltia / Decap CMS | Painel próprio + Supabase |
| --- | --- | --- | --- | --- |
| Onde fica o painel | No próprio site, em `/keystatic` | Serviço à parte (self-host v2 exige Postgres) | No site, em `/admin` | No site, com servidor |
| Login | GitHub (precisa de conta com acesso ao repositório) | E-mail (colaborador sem GitHub) | GitHub via Worker na Cloudflare | E-mail/senha próprio |
| Grava em | JSON no repositório (commit) | JSON no repositório | JSON no repositório | Banco de dados |
| Mudanças no código do site | React + adapter Vercel só na rota do painel | Nenhuma (um `.pages.yml`) | Uma pasta `public/admin` | Grandes (SSR, API, auth) |
| Imagens | Sim, salva em `src/assets` ou `public` | Sim | Sim | Sim (Storage) |
| Custo | Zero | Zero (self-host) | Zero | Zero no começo |
| Risco/manutenção | Baixo: 1 integração, versões testadas com Astro 7 (`@keystatic/astro` 6.0.0, ago/2026) | Médio: mais uma hospedagem + Postgres | Médio: Worker separado para o login | Alto: código próprio para manter |

**Por que Keystatic:** é a única opção que fica dentro do site, sem serviço extra, grava JSON nativamente (`format: { data: 'json' }`) e já suporta Astro 7. O painel é um conjunto de formulários simples, o que combina com "compacto".

**Condição:** o ADM precisa de uma conta no GitHub com permissão de escrita no repositório `wflipe/escola-prisma`. Se isso for inviável (ADM não pode ter GitHub), a alternativa é o Pages CMS, que convida colaboradores por e-mail; o resto deste plano (etapa 3, preparação do conteúdo) serve igual para ele.

**O que muda na infraestrutura:**

- Entra `@astrojs/react`, `@keystatic/core`, `@keystatic/astro` e `@astrojs/vercel`.
- As páginas públicas (`/`, `/404`) continuam pré-renderizadas (estáticas). Só `/keystatic` e `/api/keystatic/*` rodam como função na Vercel.
- 4 variáveis de ambiente na Vercel (`KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`), geradas pelo próprio Keystatic na primeira configuração.

## 3. Telas do painel (18 telas, em 3 grupos)

Cada tela é um "singleton" do Keystatic apontando para um JSON (caminhos abaixo relativos a `src/content/`). Rótulos e ajudas em português. A primeira versão tinha 10 telas; em 15/11/2026 entraram as telas que faltavam para **todo texto visível** do site ser editável (seções que tinham texto fixo no código, menu, rodapé, assuntos de WhatsApp, cartões de foto do Hero e página 404).

**Topo da página**

| Tela | Arquivo | O que o ADM controla |
| --- | --- | --- |
| **Topo (Hero)** | `site/hero.json` | Selo, título, palavra em destaque, subtítulo, botão (texto + assunto do WhatsApp), indicadores de confiança (texto) e os **3 cartões de foto** (nome, estrela, frase, foto, descrição da foto) |
| **Matrículas** | `site/matriculas.json` | Ligar/desligar banner e faixa do topo, textos, etapas, botões (o secundário pode ser escondido) |

**Seções da página** (na ordem da página)

| Tela | Arquivo | O que o ADM controla |
| --- | --- | --- |
| **Seções: ordem e visibilidade** | `site/secoes.json` | Ordem e liga/desliga de cada seção; "Mostrar depoimentos". Seção escondida some também do menu |
| **A Escola (proposta)** | `site/secao-proposta.json` | Frase acima do título, título + destaque, texto, cartões (ícone, título, texto) |
| **Manifesto** | `site/secao-manifesto.json` | Frase acima do título, título + destaque, texto, botão do WhatsApp |
| **Valores cristãos** | `site/secao-valores.json` | Selo, título + destaque, texto, cartões (ícone, título, texto) |
| **Rotina e vídeo** | `site/secao-rotina.json` | Título, texto, itens (ícone, título, texto) e vídeo (ID do YouTube, título, descrição da capa) |
| **Fases de ensino** | `site/phases.json` | Frase acima do título, título + destaque, texto, frase final ("Avançar de fase é evoluir.") e as etapas (nome, rótulo, ícone, cor, descrição, botão) |
| **Diferenciais** | `site/ecosystem.json` | Título + destaque, texto, botão ("Quero conhecer a estrutura" + assunto) e os itens |
| **Famílias: por que a Prisma** | `site/why-items.json` | Título, texto e motivos (ícone, título, descrição) |
| **Famílias: depoimentos** | `testimonials/testimonials.json` | Título, texto e depoimentos (o bloco liga em "Seções: ordem e visibilidade") |
| **Dúvidas (perguntas frequentes)** | `faqs/faqs.json` | Título e perguntas/respostas (mínimo 1; alimentam o schema FAQPage) |
| **Instagram** | `site/secao-instagram.json` | Título + destaque e texto (o @ e o link vêm de Dados da escola) |
| **Chamada final (visita)** | `site/secao-chamada-final.json` | Título + destaque, texto, botão do WhatsApp, texto de apoio e linha pequena |

**Site todo**

| Tela | Arquivo | O que o ADM controla |
| --- | --- | --- |
| **Menu e rodapé** | `site/menu-rodape.json` | Itens do menu (texto + seção de destino), botão "Fale Conosco", links "Serviço aos Pais" e "Portal do Aluno", botão flutuante do WhatsApp (nome e assunto), rodapé (títulos, sufixos dos telefones, assunto, mapa, linha de direitos) |
| **Página não encontrada (404)** | `site/pagina-404.json` | Título da aba, descrição, título, texto, botões (início e WhatsApp) |
| **Dados da escola** | `site/escola.json` | Nome, slogan (também no rodapé), ano de fundação, endereço, coordenadas, link do mapa, telefones, WhatsApp, e-mail, Instagram, Facebook. O domínio (`site`) fica fora do painel |
| **SEO e compartilhamento** | `site/seo.json` | Título e descrição da página, imagem de compartilhamento (caminho em `public/`) e sua descrição, descrição da escola e temas para o Google/IAs (schema) |

Decisões e cuidados:

- **Formato do JSON:** salvar sem mudar nada não altera nenhum arquivo (testado tela a tela). Três campos são "embrulhos" de campos do Keystatic, em `keystatic.config.ts`: `campoCoordenada` (latitude/longitude editadas como texto, de 5 a 7 casas, sem o arredondamento para 3 casas do campo de número, gravadas como número; ao ler, número com menos de 5 casas, como `-12.29` vindo de `-12.29000`, volta a ter 5, para a tela continuar salvável), `caixaMostrar` (o botão secundário de Matrículas só ganha `"mostrar": false` quando escondido) e `campoImagem` (abaixo).
- **Fotos do Hero:** campo de imagem gravando em `src/assets/images/`, com só o nome do arquivo no JSON; o site lê com `import.meta.glob` + `<Image>` (`src/utils/imagens.ts`), então continua otimizando. O campo de imagem do Keystatic renomeia os arquivos para o caminho do campo (ex.: `cartoes/cartao1/imagem.webp`) a cada "Salvar"; o `campoImagem` desliga isso, então os arquivos atuais ("Balé 1024 x 1024.webp" etc.) continuam com o mesmo nome. Uma foto nova entra com nome único: nome do arquivo enviado (sem `#`, `%`, `?` e outros caracteres problemáticos) + sufixo curto de data/hora + extensão em minúscula (ex.: `Foto Teste.JPG` → `Foto Teste-mi0k3x2a.jpg`), então nunca substitui outra foto. Tipos aceitos: webp, jpg/jpeg, png e avif (gif e heic são recusados no envio, com aviso). O site lê as extensões sem diferenciar maiúsculas. Ao trocar a foto, o Keystatic apaga o arquivo antigo.
- **Seções duplicadas:** o Keystatic não permite tirar os botões de adicionar/remover de uma lista. Por isso a lista continua (é o único jeito de reordenar arrastando) e o site trata qualquer estado: seção repetida vale só na primeira posição, seção apagada ou desconhecida fica escondida (`src/data/secoes.ts`), e a lista aceita no máximo 10 itens. A alternativa (uma caixa "mostrar" + um número de ordem por seção) não deixa repetir, mas obriga a renumerar várias seções para mover uma e permite empate de números; foi descartada por ser mais fácil de errar.
- **Menu:** cada item aponta para uma seção (lista de seleção), não para um `#id` digitado. Seção desligada = item some do menu do topo e do celular. Menu vazio = some a lista (o botão do menu do celular fica, porque nele estão telefone, portais e WhatsApp). Na página 404 os links ganham `/` na frente (`/#proposta`), porque as seções só existem na home.
- **Listas vazias:** o site não gera bloco vazio (linha de indicadores do Hero, lista de etapas do banner, `knowsAbout` do schema). Os limites de cada lista no painel seguem o layout e estão na ajuda de cada campo.
- **Links digitados:** o "Link da faixa" (Matrículas) só aceita links começando com `/`, `#` ou `https://` (bloqueia `javascript:`); os campos de link do Keystatic (`fields.url`) já recusam `javascript:`.
- **`llms.txt`:** gerado no build (`src/pages/llms.txt.ts`) com os dados de `escola.json` e `matriculas.json`, em vez de escrito à mão em `public/`.
- **Imagem de compartilhamento:** continua como texto (caminho em `public/`), porque o campo de imagem renomearia o arquivo. O build falha com mensagem clara se o arquivo não existir.

Fora do painel, de propósito: tokens de cor/fonte (`globals.css`), scripts de analytics, a estrutura e as cores das seções, posições dos cartões do Hero, a frase base do WhatsApp ("Olá! Vim pelo site da Escola Prisma e gostaria de ___.", em `src/data/escola.ts`, ligada à saudação automática) e rótulos técnicos de acessibilidade ("Navegação principal", "Abrir menu de navegação", "Menu mobile", "Ligar para a escola", "Voltar ao topo", "Etapas com matrículas abertas", "Assistir ao vídeo: …"). Mudar isso é trabalho de código, e deixar no painel só cria risco de quebrar o layout.

## 4. Etapas de implementação

Cada etapa vira um PR próprio, com preview na Vercel antes de ir para a `main`.

### Etapa 0 — Decisões e pré-requisitos

- [ ] Confirmar quem é o ADM e se terá conta GitHub (define Keystatic × Pages CMS).
- [ ] Ativar 2FA na conta GitHub do ADM (o painel dá poder de publicar no site).
- [x] Criar ponto de restauração: tag `restauracao/2026-11-15-antes-do-painel`. *(Criada localmente em 15/11/2026; ainda não enviada ao GitHub: `git push origin restauracao/2026-11-15-antes-do-painel`.)*

### Etapa 1 — Preparar o conteúdo para ser 100% editável (sem painel ainda)

Refatoração pequena, sem mudar nada visível no site. *(Feita em 15/11/2026 na branch `feat/painel-admin`, junto com a Etapa 2; o HTML de `index.html`, `404.html`, `llms.txt` e do sitemap saiu byte a byte igual ao da `main`.)*

- [x] `why-items.json`, `phases.json`, `faqs.json`, `testimonials.json` têm um array na raiz. O Keystatic grava objetos, então viram `{ "items": [...] }`. Ajustar os imports em `index.astro` e os tipos em `src/types/content.ts`. *(Depois ganharam também os títulos das seções, na raiz do objeto.)*
- [x] Mover os dados de `src/data/escola.ts` para `src/content/site/escola.json`; `escola.ts` passa a importar o JSON e continua exportando `escola`, `enderecoCompleto` e `whatsappLink()` (nada mais no site muda).
- [x] Criar `src/content/site/seo.json` (título, descrição, og:image, ID do vídeo) e ler no `BaseLayout.astro`, `schema.ts` e `DailyRoutine.astro`. *(O ID do vídeo depois foi para `secao-rotina.json`, junto com os textos da seção; o `seo.json` ganhou a descrição da imagem, a descrição da escola e os temas do schema.)*
- [x] Criar `src/content/site/secoes.json` com `{ "ativo": true/false }` por seção e ordem; `index.astro` monta a página a partir dele. A seção de depoimentos passa a ser controlada por aí (hoje está oculta por código).
- [x] Tirar do código todo texto visível que ainda era fixo: seções sem JSON (`secao-proposta`, `secao-manifesto`, `secao-valores`, `secao-rotina`, `secao-instagram`, `secao-chamada-final`), títulos e botões fixos de Fases, Diferenciais, Dúvidas e Famílias, cartões de foto do Hero, menu/rodapé/botão flutuante (`menu-rodape.json`), assuntos de WhatsApp e página 404 (`pagina-404.json`).
- [x] `npm run check` e `npm run build` com 0 erros; conferir que a página ficou idêntica. *(Comparação do `dist/client` com o build da `main`: `index.html`, `404.html` e `llms.txt` byte a byte iguais; sitemap igual a menos da data.)*

### Etapa 2 — Instalar o Keystatic (modo local, só no computador)

- [x] `npx astro add react` e `npm i @keystatic/core @keystatic/astro @astrojs/vercel`. *(15/11: `@astrojs/react` 7.1.9, `react`/`react-dom` 19.3.1, `@keystatic/core` 0.6.9, `@keystatic/astro` 6.0.0, `@astrojs/vercel` 11.0.22.)*
- [x] `astro.config.mjs`: adicionar `react()`, `keystatic()` e `adapter: vercel()`. Manter o site estático (as rotas do Keystatic já vêm com `prerender = false`). *(Também `vite.optimizeDeps.include: ['react-dom/client']`, sem o qual o painel não abre no `npm run dev`.)*
- [x] `keystatic.config.ts` com `storage: { kind: 'local' }` e os singletons da seção 3 (hoje 18), com `format: { data: 'json' }`, rótulos em português, campos de seleção para ícones (lista dos ícones existentes em `Icon.astro`) e cores (`amarela | laranja | azul | carvao`), limites de tamanho nos textos que quebram o layout (ex.: título do hero). *(Ficaram 10 telas nessa etapa, depois 18: ver seção 3. "Diferenciais" e "Por que a Prisma" são separadas, uma por arquivo. `storage` já é `local` em dev e `github` em produção. `ogImage` ficou como texto (caminho), porque o campo de imagem do Keystatic renomeia o arquivo para `ogImage.png` ao salvar.)*
- [x] Testar em `localhost:4321/keystatic`: editar cada tela, conferir que o JSON gravado é igual ao formato atual (chaves, ordem, acentos) e que o site reflete a mudança. *(Testado com navegador headless: alterar e reverter em cada tela mantém o conteúdo idêntico; o Keystatic regrava com `JSON.stringify(dados, null, 2)` + quebra de linha, então os JSON já foram normalizados para esse formato, e omite texto vazio, por isso `anoFundacao` vazio saiu de `escola.json` e ficou opcional no tipo.)*
- [x] Conferir que `dist/` continua com `index.html` estático e que o Lighthouse da home não mudou (o React não deve entrar na página pública). *(Com o adapter, o HTML estático fica em `dist/client/` e `.vercel/output/static/`. `index.html` e `404.html` idênticos ao build anterior, sem nenhum JS de React; Lighthouse não foi rodado de novo, já que o HTML não mudou.)*

### Etapa 3 — Ligar ao GitHub e publicar (concluída em 15/11/2026)

- [x] Trocar para `storage: { kind: 'github', repo: 'wflipe/escola-prisma' }`. *(`local` no `npm run dev`, `github` no build de produção.)*
- [x] Criar o GitHub App `escola-prisma-painel` (conta `wflipe`). **Correção do plano:** o assistente do Keystatic que cria o app sozinho só aparece rodando o site no computador com `storage: github`. No site publicado, sem as variáveis, `/keystatic` mostra só "Log in with GitHub" e o login dá erro 500 (log da Vercel: `Missing required config in Keystatic API setup when using the 'github' storage mode`). Por isso o app foi criado à mão (passo a passo abaixo).
- [x] Cadastrar as 4 variáveis de ambiente na Vercel (só **Production**) e fazer Redeploy.
- [x] Mesclar o PR (#7) e testar o login em produção.

#### Como o GitHub App foi configurado (para refazer, se precisar)

Em <https://github.com/settings/apps/new>, logado como `wflipe`:

| Campo | Valor |
| --- | --- |
| GitHub App name | `escola-prisma-painel` |
| Homepage URL | `https://www.escolaprisma.net.br/keystatic` |
| Redirect URI (callback) | `https://www.escolaprisma.net.br/api/keystatic/github/oauth/callback` |
| Expire user authorization tokens | marcado |
| Request user authorization during installation, Device Flow, wildcard | desmarcados (opcionais) |
| Webhook → Active | **desmarcado** |
| Repository permissions | **Contents: Read and write** · Metadata: Read-only (obrigatório) · **Pull requests: Read-only** · o resto "No access" |
| Organization / Account / Enterprise permissions | tudo "No access" |
| Subscribe to events | nenhum |
| Where can this GitHub App be installed? | Only on this account |

São as mesmas permissões que o assistente do Keystatic pediria (`contents: write`, `metadata: read`, `pull_requests: read`, conferido no código de `@keystatic/core`).

Depois de criar:

1. **Client ID**: na página do app (começa com `Iv23`).
2. **Client secret**: menu **Credentials → Generate a new client secret** (aparece uma vez só).
3. **Slug**: final do endereço do app (`github.com/apps/escola-prisma-painel` → `escola-prisma-painel`).
4. **Install App → Install → Only select repositories → `escola-prisma`**. Não deixar em "All repositories": o app teria escrita em todos os repositórios da conta.
5. **Private key**: o painel não usa. Se o GitHub gerou uma, apagar em **App settings → Private keys** e apagar o arquivo `.pem` baixado.

#### Variáveis na Vercel

Projeto `escola-prisma` → **Settings → Environment Variables**, ambiente **Production**. O Preview não precisa: o callback só aceita o domínio oficial, e o preview tem proteção de login da Vercel.

| Nome | Valor | Tipo na Vercel |
| --- | --- | --- |
| `KEYSTATIC_GITHUB_CLIENT_ID` | Client ID | Secret |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | client secret | Secret |
| `KEYSTATIC_SECRET` | texto aleatório com 32+ caracteres: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` | Secret |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | `escola-prisma-painel` | **Config** (a Vercel recusa o tipo Secret em variável `PUBLIC_`; o slug não é segredo) |

Depois de salvar: **Deployments → último deploy → ⋯ → Redeploy** (sem novo deploy a variável `PUBLIC_` não entra no site). Uma cópia local dos valores pode ficar em `.env` na raiz (está no `.gitignore`); dá para colar o conteúdo dele inteiro no primeiro campo "Key" da Vercel.

#### Trocar o client secret (rotina de segurança)

Gerar um novo em **App settings → Credentials**, apagar o antigo, atualizar `KEYSTATIC_GITHUB_CLIENT_SECRET` na Vercel e fazer Redeploy. Fazer isso sempre que o valor aparecer em print, e-mail ou conversa. Para cortar o acesso de todo mundo de uma vez: **Revoke all user tokens** na página do app.

#### Se o login falhar

| Sintoma | Causa provável |
| --- | --- |
| Erro 500 em `/api/keystatic/github/login` | Variável faltando ou Redeploy não feito (ver Vercel → Logs) |
| GitHub diz "redirect_uri is not associated with this application" | Redirect URI diferente de `https://www.escolaprisma.net.br/api/keystatic/github/oauth/callback` (atenção ao `www`) |
| Entra, mas não vê o repositório ou não salva | App não instalado no repositório `escola-prisma`, ou a conta não tem permissão de escrita nele |
| `KEYSTATIC_SECRET must be at least 32 characters long` | Segredo curto demais |

### Etapa 4 — Segurança e ajustes finos

- [x] `robots.txt`: `Disallow: /keystatic` e `/api/`; `noindex` nas rotas do painel; tirar do sitemap. *(`X-Robots-Tag: noindex, nofollow` no `vercel.json` para `/keystatic(.*)` e `/api/keystatic(.*)`; `filter` na integração do sitemap.)*
- [x] `vercel.json`: o cabeçalho `Content-Security-Policy-Report-Only` precisa liberar `api.github.com` e `github.com` em `connect-src`/`form-action` para a rota `/keystatic` (ou excluir o painel dessa regra). Conferir também que `X-Frame-Options` e `Cache-Control` não atrapalham. *(Feito: o CSP do site não vale mais para o painel; o painel tem um CSP Report-Only próprio com GitHub liberado e `Cache-Control: private, no-store`. `X-Frame-Options: SAMEORIGIN` continua e não atrapalha. Conferir os cabeçalhos no primeiro preview da Vercel com `curl -I`.)*
- [ ] Opcional: `branchPrefix: 'conteudo/'` para que o ADM possa salvar numa branch de rascunho e abrir PR, em vez de publicar direto. Recomendação inicial: publicar direto na `main` (mais simples) e usar o histórico do Git para reverter.
- [x] Registrar no `CHANGELOG.md` e no `README.md` (seção "Estrutura" e novo item "Painel"). *(README e CHANGELOG feitos; o número do PR entra no CHANGELOG quando ele for aberto.)*

### Etapa 5 — Manual do ADM

- [x] Criar `docs/PAINEL-ADMIN.md` com: como entrar, o que cada tela faz, quanto tempo leva para publicar (1–2 min), como acompanhar o deploy na Vercel, como desfazer uma mudança (reverter o commit pelo GitHub), limites (tamanho de imagem, textos longos) e o que **não** está no painel.
  *(Feito em 15/11/2026: [PAINEL-ADMIN.md](PAINEL-ADMIN.md); revisado depois da Etapa 3 com a tela real de login.)*
- [ ] Sessão de 30 min com o ADM editando uma coisa de cada tela.

## 5. Riscos e como lidar

| Risco | Mitigação |
| --- | --- |
| ADM quebra o layout com texto longo demais | Validação de tamanho nos campos; preview da Vercel antes de mesclar, se usar `branchPrefix` |
| Imagem pesada derruba a nota de desempenho | Campo de imagem com orientação (webp, até 1024px); o Astro otimiza as de `src/assets` |
| Keystatic deixar de ser mantido | O conteúdo continua em JSON no repositório. Trocar o painel não perde nada |
| Vazamento das variáveis do GitHub App | Ficam só na Vercel; nunca commitadas (`.env` já no `.gitignore`); revogar e gerar de novo se preciso |
| Painel exposto na internet | Só entra quem tem acesso de escrita no repositório; 2FA no GitHub |

## 6. Estimativa

| Etapa | Esforço |
| --- | --- |
| 1 — Preparar conteúdo | 3–4 h |
| 2 — Keystatic local | 3–4 h |
| 3 — GitHub + Vercel | 1–2 h |
| 4 — Segurança | 1–2 h |
| 5 — Manual + treino | 1–2 h |
| **Total** | **~2 dias de trabalho** |

## 7. Fora deste plano (pode vir depois)

- Páginas novas (blog, notícias): o Keystatic suporta "collections" em MDX, e o site já tem `@astrojs/mdx`.
- Edição visual com preview ao vivo (clicar na seção e editar no lugar): exigiria outra ferramenta ou painel próprio.
- Formulário de matrícula com envio para a escola: precisaria de backend (Supabase ou similar).
