# Plano de correções — Site Escola Prisma

Criado em 13/11/2026 a partir de uma leitura completa do código (commit `83f8a12`).
Status: **etapas 1–5 concluídas** em 13/11/2026 na branch `fix/correcoes-e-banner-matriculas` (commits `4d42f2b` e `1cfd751`). Branch e tags enviadas ao GitHub e [PR #1](https://github.com/wflipe/escola-prisma/pull/1) aberto. Falta a etapa 6: revisar o preview e fazer o merge. Histórico em [CHANGELOG.md](../CHANGELOG.md).

## Andamento

- [x] **Etapa 0:** dependências instaladas. Foi preciso adicionar `@astrojs/check` e `typescript` (devDependencies), porque sem eles o `npm run check` nunca rodou.
- [x] **Etapa 1:** tipos criados em `src/types/content.ts`. O `astro check` também acusou erros antigos em `Card`, `Button` e `mobile-menu.ts`, já corrigidos. Resultado: **0 erros**.
- [x] **Etapa 2:** o Hero lê o `hero.json`, e o texto oficial é o que estava no ar.
- [x] **Etapa 3:** `slider` removido; `public/scripts/` e os `.js` duplicados apagados. Os scripts agora são empacotados pelo Astro a partir de `src/scripts/*.ts`.
- [x] **Etapa 4:** endereço, CEP, coordenadas, schema `School` + `FAQPage`, `courseSchema` removido, `@escolaprisma_` corrigido (e o ícone do Instagram, que não existia).
- [x] **Extra:** dados oficiais centralizados em `src/data/escola.ts`; links do WhatsApp padronizados (ver `docs/WHATSAPP-SAUDACAO.md`); vídeo da rotina trocado para `qYuossXmZfc`; banner de matrículas criado (ver `docs/BANNER-MATRICULAS.md`).
- [x] **Organização:** relatórios do Lighthouse e imagens sem uso (3 duplicadas apagadas) movidos para `arquivo/`; `.gitignore` atualizado.
- [x] **Ponto de restauração:** commit + tags `restauracao/2026-11-13-antes-das-correcoes` e `restauracao/2026-11-13-correcoes-e-banner` (ver `docs/RESTAURACAO.md`).
- [x] **Domínio (commit `1cfd751`):** o domínio oficial é `www.escolaprisma.net.br`, e o site no ar apontava a canonical para `escolaprisma.com` (outro site). Corrigido; ver [SEO-GEO.md](SEO-GEO.md).
- [x] **SEO/GEO (commit `1cfd751`):** `llms.txt`, título/descrição, `knowsAbout`, FAQ com 13 perguntas.
- [x] **Monitoramento (commit `1cfd751`):** Umami + Clarity; ver [MONITORAMENTO.md](MONITORAMENTO.md).
- [x] **Celular (commit `1cfd751`):** sem transbordo horizontal de 280px a 393px (testado no Chrome).
- [x] **Etapa 6a:** push da branch e das tags; [PR #1](https://github.com/wflipe/escola-prisma/pull/1) aberto (13/11/2026).
- [x] **Ajustes locais após o PR (ainda sem commit):** capa do vídeo (sem faixas pretas e sem nome do canal), faixa "Matrículas 2027 abertas" no topo, botão do banner "Garanta a vaga do seu filho" / "Garanta a vaga" sem setas. Ver [CHANGELOG.md](../CHANGELOG.md).
- [ ] **Etapa 6b:** commit + push desses ajustes (o PR #1 se atualiza sozinho), revisão visual no preview da Vercel (checks do PR: Vercel ✔, Netlify ✔), Lighthouse e merge. Depois do deploy: pedir indexação no Search Console.
- [ ] **Fora do código:** configurar a saudação no WhatsApp Business e trocar o link da bio do Instagram de `escolaprisma.com` para `escolaprisma.net.br`.

---

Abaixo, o plano original (mantido como referência).

O plano foi dividido em etapas pequenas e independentes, cada uma podendo virar um commit próprio.
A ordem prioriza o que quebra a verificação (`astro check`) e depois o que afeta conteúdo, SEO e limpeza.

---

## Etapa 0 — Preparação

- [ ] Instalar dependências: `npm install` (Node >= 22.12).
- [ ] Rodar `npm run check` e `npm run build` e guardar a saída como referência do "antes".
- [ ] Criar uma branch de trabalho: `git checkout -b fix/correcoes-leitura-projeto`.

---

## Etapa 1 — Tipos de conteúdo inexistentes (prioridade alta)

**Problema:** dois componentes importam tipos de módulos que não existem; só há os arquivos `.json`.

| Arquivo | Import quebrado |
| --- | --- |
| `src/components/sections/Hero.astro:10` | `import type { HeroData } from '../../content/site/hero'` |
| `src/components/sections/FAQ.astro:4` | `import type { FAQItem } from '../../content/faqs/faqs'` |

**Correção:**

1. Criar `src/types/content.ts` com as interfaces, baseadas no formato real dos JSON:

   ```ts
   export interface HeroCTA { text: string; link: string; }
   export interface TrustIndicator { icon: string; text: string; }
   export interface HeroData {
     badge: string;
     headline: string;
     subheadline: string;
     primaryCTA: HeroCTA;
     trustIndicators: TrustIndicator[];
   }
   export interface FAQItem { question: string; answer: string; }
   ```

2. Trocar os imports em `Hero.astro` e `FAQ.astro` para `../../types/content`.
3. Conferir se outros componentes (Phases, Ecosystem, SocialProof) declaram tipos inline e, se fizer sentido, movê-los para o mesmo arquivo.

**Validação:** `npm run check` sem erros relacionados a esses imports.

---

## Etapa 2 — Hero com texto fixo e JSON fora de sincronia (prioridade alta)

**Problema:** `Hero.astro` tem o selo, o título e o subtítulo escritos no próprio componente. Os campos `badge`, `headline` e `subheadline` de `src/content/site/hero.json` são ignorados, e os textos já diferem:

| Campo | No componente (o que aparece no site) | No `hero.json` |
| --- | --- | --- |
| badge | Formação humana · Acolhimento · Vestibular | Formação humana · Excelência acadêmica · Tecnologia |
| headline | …preparado para o **mundo**, com o *cuidado* que ele **merece** hoje. | …preparado para o **futuro**, com o cuidado que ele **precisa** hoje. |
| subheadline | …inglês avançado, esporte… reconhecido pelo nome. | …inglês, tecnologia, esporte… conhecido pelo nome. |

**Correção:**

1. **Decisão da escola/marketing:** qual versão do texto é a oficial. (Por padrão, manter a que está no ar, ou seja, a do componente.)
2. Atualizar `hero.json` com a versão escolhida.
3. Fazer o componente ler de `data.badge`, `data.headline` e `data.subheadline`.
4. Para manter o destaque em serifa itálica na palavra "cuidado", adicionar ao JSON um campo `headlineHighlight` (ex.: `"cuidado"`) e, no componente, dividir o título nessa palavra para envolvê-la em `<span class="font-serif italic text-accent">`.

**Validação:** o Hero renderiza exatamente o mesmo texto de antes (comparar visualmente no `npm run dev`).

---

## Etapa 3 — Scripts: código morto, duplicado e caminho frágil (prioridade média)

**Problemas:**

- `public/scripts/slider.js` é carregado em toda página, mas procura `#heroSlider`, que não existe mais (o Hero virou cards flutuantes).
- `src/scripts/*.ts` e `src/scripts/*.js` não são importados por nada. Os scripts em uso são os de `public/scripts/`. O `slider.js` já está diferente entre as duas pastas.
- `BaseLayout.astro:96-98` usa `src="../scripts/..."`, um caminho relativo que só funciona por acaso na raiz do site.

**Correção (opção recomendada: scripts processados pelo Astro):**

1. Remover a tag do `slider.js` em `BaseLayout.astro` e apagar `public/scripts/slider.js`, `src/scripts/slider.ts` e `src/scripts/slider.js`.
2. Manter como fonte única `src/scripts/mobile-menu.ts` e `src/scripts/back-to-top.ts`, depois de compará-los com as versões de `public/scripts/` e preservar qualquer diferença.
3. No `BaseLayout.astro`, trocar as tags `is:inline` por:

   ```astro
   <script>
     import '../scripts/mobile-menu';
     import '../scripts/back-to-top';
   </script>
   ```

   Assim o Astro empacota, minifica e aplica `type="module"` (que já roda depois do parse do HTML).
4. Apagar `public/scripts/` e os `.js` duplicados de `src/scripts/`.
5. Ajustar os scripts se eles dependerem de `DOMContentLoaded`: com módulo, o DOM já está pronto, mas manter o listener não causa problema.

**Alternativa mínima:** manter `public/scripts/`, apagar só o `slider` e o conteúdo de `src/scripts/`, e trocar os caminhos para `/scripts/mobile-menu.js` e `/scripts/back-to-top.js`.

**Validação:** menu mobile abre e fecha; botão "voltar ao topo" aparece ao rolar e funciona; console sem erros.

---

## Etapa 4 — Endereço, localização e dados estruturados (prioridade média)

### 4.1 Endereço e CEP (decidido em 13/11/2026)

Endereço oficial informado pela escola: **Caminho 16 - Tomba, Feira de Santana - BA, 44091-554**.

| Local | Hoje | Correção |
| --- | --- | --- |
| `src/utils/schema.ts:20` (`postalCode`) | `44100-000` | `44091-554` |
| `src/utils/schema.ts:17` (`streetAddress`) | `Caminho 16, Conjunto Feira VII, 16 - Tomba` | `Caminho 16 - Tomba` (igual ao Perfil da Empresa no Google). O "nº 16" sai: o próprio Google indica que o imóvel não tem número. |
| `src/components/layout/Footer.astro:21` (texto visível) | `Caminho 16, Conjunto Feira VII, Nº 16 / Tomba Feira de Santana - BA \| CEP 44100-000` | `Caminho 16 - Tomba / Feira de Santana - BA \| CEP 44091-554` |

### 4.2 Coordenadas geográficas

As meta tags `geo.position` e `ICBM` (`BaseLayout.astro:61-62`) apontam para `-12.2858, -38.9556`. O pin do Google Maps embutido no rodapé fica em `-12.2949, -38.9457`, cerca de 1,4 km de distância.

- Trocar as duas meta tags para `-12.2949;-38.9457` (o mesmo ponto do mapa). O ponto foi confirmado pelo Plus Code do Perfil no Google, `P343+2P Tomba` (código completo `59V3P343+2P`), que decodifica para `-12.29494, -38.94574`.
- Adicionar `geo` (`GeoCoordinates`) ao schema da organização com essas coordenadas.

### 4.3 Dados estruturados: o que vale a pena (recomendação)

**`courseSchema` → remover.** O Google descontinuou o resultado aprimorado de cursos ("Course info") em 2025, e ele era voltado a cursos avulsos (online, livres), não a séries escolares. Marcar "Educação Infantil" ou "Ensino Médio" como `Course` não gera nenhum destaque na busca e só adiciona código para manter.

**`faqPageSchema` → usar, sem esperar destaque visual.** Desde 2023 o Google só mostra as perguntas expandidas no resultado para sites governamentais e de saúde. Mesmo assim, a marcação é barata (os dados já estão em `faqs.json`), é lida pelo Bing e ajuda buscadores e assistentes de IA a extrair respostas corretas sobre a escola.

**O que realmente traz resultado para uma escola local: reforçar a ficha da organização.** É isso que alimenta o painel do Google (nome, endereço, telefone, mapa) e a busca local ("escola no Tomba", "escola em Feira de Santana"):

1. Trocar o `@type` para `["School", "LocalBusiness"]` (ou só `School`, que é mais específico que `EducationalOrganization`).
2. Incluir `telephone` no nível principal, `geo` (item 4.2), `hasMap` (link do Google Maps), `openingHoursSpecification` (horário da secretaria, a confirmar com a escola) e `image` (logo ou foto da fachada).
3. Incluir `foundingDate` (o hero.json diz "29 anos de história"; confirmar o ano de fundação).
4. **Não** colocar `aggregateRating` com a nota 4.9 do Google: o Google ignora ou penaliza avaliações que a própria empresa publica sobre si.
5. Fora do código, e com mais impacto que qualquer item acima: manter o **Perfil da Empresa no Google** com o mesmo nome, endereço, CEP e telefone do site.

### 4.4 Consistência com o Perfil da Empresa no Google e o Instagram

Comparação feita em 13/11/2026 com o Perfil no Google (Maps e busca) e o Instagram `@escolaprisma_`. O Google confia mais no negócio quando nome, endereço, telefone e site são **idênticos** em todos os lugares.

| Dado | Site hoje | Google / Instagram | Ação |
| --- | --- | --- | --- |
| Endereço | `Caminho 16, Conjunto Feira VII, Nº 16 - Tomba`, CEP 44100-000 | `Caminho 16 - Tomba, Feira de Santana - BA, 44091-554` | Corrigir no site (4.1) |
| Telefone principal | Schema e TopBar: fixo `(75) 3622-9180`; WhatsApp `(75) 99895-4848` no rodapé e nos CTAs | Só `(75) 99895-4848` | No schema, usar `+55-75-99895-4848` como `telephone` principal. **Confirmar se o fixo ainda funciona**: se sim, manter como segundo contato; se não, remover do TopBar, do MobileMenu e do Footer. |
| Site | Canonical, schema e sitemap apontavam para `www.escolaprisma.com` (outro site) | Perfil no Google: `escolaprisma.net.br` ✔ · Bio do Instagram: `escolaprisma.com` ✘ | **Corrigido em 13/11/2026:** domínio oficial é `https://www.escolaprisma.net.br` (Vercel). Falta trocar o link da bio do Instagram. |
| Instagram | `SocialFeed.astro:12` mostra `@escolaprisma` | O perfil é `@escolaprisma_` | Corrigir o texto para `@escolaprisma_`. O link no schema já está certo. |
| Horário | Não informado | Abre seg. às 06:50 | Adicionar `openingHoursSpecification` quando a escola informar o horário de fechamento. |
| Fundação | "29 anos de história" | "Há 29 anos formando para a vida" | `foundingDate: "1997"`, a confirmar. |
| Avaliação | Hero: "4.9 no Google" | A busca mostra Facebook 4,8/5 (16 votos); a nota do Google não aparece no print | **Confirmar a nota atual no Google** antes de manter o "4.9" no Hero. |

### 4.5 Implementação

1. Mudar a prop `schema` do `BaseLayout` para aceitar `SchemaOrg | SchemaOrg[]` e gerar um `<script type="application/ld+json">` por item (ou um `@graph`).
2. Em `index.astro`, passar `[educationalOrganizationSchema(), faqPageSchema(faqsData)]`.
3. Apagar `courseSchema` de `src/utils/schema.ts`.

**Validação:** testar a página publicada no [Teste de pesquisa aprimorada](https://search.google.com/test/rich-results) e no [Schema Markup Validator](https://validator.schema.org/).

---

## Etapa 5 — Arquivos pesados no repositório (decidido: manter)

**Decisão (13/11/2026):** o projeto está no GitHub e é publicado na Vercel. Arquivos que não pesam no site final podem continuar no GitHub.

**Análise:** nenhum dos itens abaixo vai para o site publicado. O Astro só publica o que está em `public/` e as imagens de `src/` que algum componente importa. Por isso eles não afetam o tamanho nem a velocidade do site:

| Item | Tamanho aprox. | Vai para o site? | Ação |
| --- | --- | --- | --- |
| `lighthouse-full.json`, `lighthouse-result.json` | 4,3 MB | Não (raiz do projeto) | Manter |
| `localhost_2026-08-18_*.report.{html,json}` | 3,1 MB | Não (raiz do projeto) | Manter |
| `Documentos/*.pdf` | 42 MB | Não | Manter |
| `src/assets/student-*.png` | 2 MB | Não (nenhum import) | Manter |
| `src/assets/images/*.png` | — | Não (o Hero importa só os `.webp`) | Manter |

**Única ação (opcional):** o único efeito desses arquivos é deixar mais lento o clone que a Vercel faz a cada deploy, o que é desprezível. Se no futuro quiser evitar que novos relatórios do Lighthouse entrem no Git, adicionar ao `.gitignore`:

```gitignore
# relatórios locais do Lighthouse
lighthouse*.json
*.report.html
*.report.json
```

**Cuidado:** se algum dia um PDF tiver que ser baixado pelo site (ex.: o PPP), ele precisa ir para `public/`. Aí, sim, deve ser comprimido antes, porque passa a fazer parte do site.

---

## Etapa 6 — Verificação final e entrega

- [ ] `npm run check` sem erros.
- [ ] `npm run build` concluído; `dist/` gerado com `sitemap-index.xml`.
- [ ] `npm run preview` e revisão visual: Hero, menu mobile, FAQ, back-to-top, botão do WhatsApp.
- [ ] Lighthouse mobile novamente (sem commitar o relatório) para confirmar que a performance não caiu.
- [ ] Atualizar o status deste documento e o `README.md`.
- [ ] Abrir PR para `main`.

---

## Decisões

**Tomadas em 13/11/2026:**

- [x] Endereço oficial: Caminho 16 - Tomba, Feira de Santana - BA, **44091-554**, sem "Conjunto Feira VII, nº 16" (Etapa 4.1).
- [x] Coordenadas: `-12.2949, -38.9457` (Plus Code `P343+2P`) (Etapa 4.2).
- [x] Arquivos pesados que não vão para o site ficam no GitHub (Etapa 5).
- [x] `courseSchema` será removido; o esforço vai para a ficha da organização e o schema da FAQ (Etapa 4.3).

- [x] Texto do Hero: manter o que está no ar (matrículas abertas).
- [x] Telefone fixo (75) 3622-9180 continua ativo: fica no site como segundo contato. O principal no schema é o WhatsApp, igual ao Google.
- [x] "4.9 no Google": mantido por decisão da escola. A nota não foi conferida no Perfil do Google; vale confirmar.
- [x] WhatsApp: o site envia a mensagem do pai; a frase de boas-vindas vira saudação automática do WhatsApp Business.
- [x] Banner de matrículas: faixa após o Hero, criada no site, horizontal/vertical.

- [x] Textos do site revisados (commit `dcd478f`), mantendo título do Hero, botões e slogan.

**Ainda pendentes (opcionais):**

1. Horário de fechamento (para `openingHoursSpecification`) e ano de fundação (`foundingDate`).
2. Depoimentos: o bloco "O que dizem as famílias" está **oculto desde 14/11/2026**. Antes de mostrar de novo, confirmar que os depoimentos (hoje Mariana, 4º ano; Carlos, 8º ano) são de famílias reais e autorizados, ou trocar por depoimentos verdadeiros em `testimonials.json`, e mudar `MOSTRAR_DEPOIMENTOS` para `true` em `SocialProof.astro`.
3. Depois do deploy: reenviar o sitemap e pedir indexação no Google Search Console.

**Fora do código (responsável: quem administra o Perfil da Empresa no Google):**

- [x] Perfil no Google já aponta para `escolaprisma.net.br`, que é o domínio oficial (nada a fazer).
- [ ] Trocar o link da bio do Instagram de `www.escolaprisma.com` para `www.escolaprisma.net.br`.

## Hospedagem

- Código no **GitHub**; deploy automático na **Vercel** como site estático (`astro build` → `dist/`, sem adapter).
- Antes de fazer merge na `main`, conferir o deploy de preview que a Vercel gera para o PR.
