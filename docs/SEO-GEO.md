# SEO, GEO e busca local

**SEO** = aparecer no Google. **GEO** (Generative Engine Optimization) = ser citado corretamente por assistentes de IA (ChatGPT, Gemini, Perplexity, Visão geral do Google).
As duas dependem das mesmas coisas: dados corretos, consistentes e fáceis de ler por máquinas.

## Domínio oficial

**https://www.escolaprisma.net.br**, hospedado na Vercel. `escolaprisma.net.br` (sem `www`) redireciona para ele (308).

> ⚠️ `www.escolaprisma.com` é **outro site** (antigo). Nunca use `.com` como endereço do site.
> Até 13/11/2026, o site no ar declarava a canonical como `.com`, o que dizia ao Google para priorizar o site antigo. A correção está no [PR #1](https://github.com/wflipe/escola-prisma/pull/1) e vai ao ar quando ele for incorporado à `main`.

O domínio é definido em **dois lugares**, que precisam ser iguais:

| Arquivo | Campo | Usado por |
| --- | --- | --- |
| `astro.config.mjs` | `site` | canonical, `og:url`, `og:image`, sitemap |
| `src/content/site/escola.json` | `site` | dados estruturados (schema), `llms.txt` (gerado no build). Fica fora do painel `/keystatic` (o painel preserva o valor) e o build falha se for diferente do `astro.config.mjs` |

Se o domínio mudar, atualize também: `public/robots.txt`, Umami (`data-domains`) o filtro de domínio do Google Tag Manager no `BaseLayout` (ver [MONITORAMENTO.md](MONITORAMENTO.md)).

## O que o site entrega para buscadores e IAs

| Item | Onde | Para quê |
| --- | --- | --- |
| `<title>` e `meta description` | `src/pages/index.astro` | Texto do resultado no Google. Contém a busca principal: "escola particular em Feira de Santana". |
| Canonical + Open Graph (URL absoluta) | `src/layouts/BaseLayout.astro` | Endereço oficial da página; imagem e texto ao compartilhar no WhatsApp/Facebook. |
| Meta geo (`geo.position`, `ICBM`) | `BaseLayout.astro` | Coordenadas da escola (-12.29491, -38.94568), lidas de `escola.geo`. |
| Schema `School` | `src/utils/schema.ts` | Ficha da escola: endereço, coordenadas, telefones, mapa, redes, `knowsAbout` (etapas, Sistema Positivo, ENEM/UEFS, Balé, Karatê…). |
| Schema `FAQPage` | `schema.ts` + `src/content/faqs/faqs.json` | As 13 perguntas da FAQ em formato que IAs e o Bing leem diretamente. |
| `sitemap-index.xml` | gerado pelo `@astrojs/sitemap` | Lista de páginas para o Google. |
| `robots.txt` | `public/robots.txt` | Libera tudo e aponta o sitemap. |
| `llms.txt` | `src/pages/llms.txt.ts` (gerado no build) | Resumo da escola em texto simples, feito para assistentes de IA. |

### FAQ: as 4 primeiras perguntas são "de busca"

As 4 primeiras perguntas de `faqs.json` respondem ao que as pessoas digitam ou perguntam a uma IA:

1. Quais etapas de ensino a Escola Prisma oferece?
2. Onde fica a Escola Prisma?
3. Qual material didático a escola usa?
4. A escola prepara para o ENEM e a UEFS?

As demais (5–13) respondem às dúvidas dos pais na decisão de matrícula. Ao acrescentar perguntas, prefira frases completas, como um pai perguntaria.

### `llms.txt`

Publicado em `https://www.escolaprisma.net.br/llms.txt`. Desde 15/11/2026 é **gerado no build** por `src/pages/llms.txt.ts` (antes era `public/llms.txt`, escrito à mão; o texto gerado é byte a byte igual ao antigo):

- **Vem do painel, sozinho:** nome, slogan, site, endereço, mapa, telefones, e-mail, Instagram e Facebook (`escola.json`, tela "Dados da escola") e a linha de matrículas (`matriculas.json`: com o banner ligado começa com o selo, ex.: "Matrículas abertas."; com o banner desligado, essa parte some).
- **Fica no código** (`llms.txt.ts`): o parágrafo de apresentação e os resumos de etapas e diferenciais, escritos para IA e mais curtos que os textos da página. Ao mudar etapas ou diferenciais no painel, confira essas listas.

## Regras de consistência (NAP: nome, endereço, telefone)

Os dados abaixo devem ser **idênticos** no site (`src/content/site/escola.json`), no `llms.txt`, no Perfil da Empresa no Google e nas redes:

| Dado | Valor oficial | Perfil no Google | Instagram |
| --- | --- | --- | --- |
| Nome | Escola Prisma | ✔ | ✔ |
| Endereço | Caminho 16 - Tomba, Feira de Santana - BA, 44091-554 (falta confirmar nº e "Conjunto Feira VII") | ✔ | — |
| Telefone principal | (75) 99895-4848 | ✔ | — |
| Site | www.escolaprisma.net.br | ✔ | ✘ bio aponta para `escolaprisma.com` |

## O que **não** fazer

- **Não** colocar a nota "4.9 no Google" no schema (`aggregateRating`). O Google ignora ou penaliza avaliações que a própria escola publica sobre si. A nota aparece só como texto no Hero.
- **Não** usar `Course` para séries escolares (o Google descontinuou esse resultado; o `courseSchema` foi removido).
- **Não** usar pop-up de tela cheia no celular (penalização de "intersticial intrusivo"). Por isso o banner de matrículas é uma faixa na página.

## Pendências

- [ ] Trocar o link da bio do Instagram para `www.escolaprisma.net.br`.
- [ ] Preencher `anoFundacao` em `src/content/site/escola.json` (ex.: `"1997"`) quando a escola confirmar. Enquanto estiver vazio, `foundingDate` não aparece no schema.
- [ ] Horário de funcionamento (abre seg. 06:50; fechamento a confirmar) → `openingHoursSpecification`.
- [ ] Confirmar se o e-mail `secretaria@escolaprisma.com` e o portal `pais.escolaprisma.com` continuam no domínio `.com`.
- [ ] Depois do deploy: no **Google Search Console**, inspecionar `https://www.escolaprisma.net.br/` e pedir indexação; enviar o sitemap `https://www.escolaprisma.net.br/sitemap-index.xml`.
- [ ] Validar o schema em <https://search.google.com/test/rich-results> e <https://validator.schema.org/>. Desde 14/11/2026 devem aparecer 4 itens: `School`, `WebSite`, `WebPage` (no mesmo `@graph`) e `FAQPage`.
- [ ] Domínio antigo `www.escolaprisma.com` ainda responde com o site antigo: redirecionar com 301 (ver [AUDITORIA-SEO-2026-11.md](AUDITORIA-SEO-2026-11.md)).
- [ ] Endereço divergente nos diretórios (Melhor Escola, escol.as/INEP, Telelistas): ver a seção 1.2 da auditoria.
