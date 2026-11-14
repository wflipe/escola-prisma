# Auditoria de SEO: Escola Prisma

**Data:** 14/11/2026
**Site:** https://www.escolaprisma.net.br (commit `d30a4f0` da `main`, igual ao que está no ar)
**Método:** 5 agentes em paralelo usando os critérios do plugin [claude-seo](https://github.com/AgriciDaniel/claude-seo) v2.6.0: Técnico+Performance, Conteúdo+SXO, Schema, SEO Local e GEO/IA. Os scripts do plugin não foram executados. A análise foi feita sobre o `dist/`, o código-fonte, o site no ar e fontes públicas.

## Notas

| Categoria | Peso | Nota | Observação |
|---|---|---|---|
| SEO técnico | 22% | 78 | |
| Qualidade de conteúdo (E-E-A-T) | 23% | 58 | |
| On-page (títulos, headings, links) | 20% | ~65 | estimada a partir dos achados |
| Schema / dados estruturados | 10% | 74 | |
| Performance (CWV) | 10% | ~80 | **estimada pelo código**: o PageSpeed sem chave bateu cota |
| Prontidão para busca por IA | 10% | 60 | |
| Imagens | 5% | ~75 | estimada |
| **Nota geral de SEO** | | **≈ 69/100** | |
| SEO local (à parte) | | **44/100** | o ponto mais fraco |
| SXO (experiência de busca) | | 55/100 | |

## Andamento

**Corrigido no código e publicado em 14/11/2026 ([PR #3](https://github.com/wflipe/escola-prisma/pull/3)):** 3.1 (cabeçalhos; CSP ainda em Report-Only), 3.2 (fontes), 3.3 (hero), 3.4 (feed), 3.5 (404), 3.6 (schema em `@graph`), 3.7 (geo), 3.15 (`aria-label`), e da seção 4: telefone fixo lido de `escola.ts`, `url` com barra, logo `ImageObject`, Open Graph, `prefetch`, cache de `/assets`, `lastmod`, `rel` do Curator e escape do JSON-LD.

**Não precisa mudar:** 3.8. O `docs/SEO-GEO.md` registra o WhatsApp como telefone principal no Perfil no Google, então o `telephone` do schema já está certo.

**Já ocultado antes (PR #2):** 1.3 (depoimentos).

**Falta (depende da escola ou de quem administra o domínio):** 1.1 (301 do `.com`), 1.2 (endereço nos diretórios), toda a seção 2, e 3.9 a 3.14 (texto e conteúdo, que pedem os dados da seção 7). Também ficam para depois: renomear as imagens com acento, títulos do rodapé, `mailto` (o e-mail ainda não foi confirmado) e passar a CSP de Report-Only para valer.

**Depois do deploy:** rodar o PageSpeed (pagespeed.web.dev) e o validator.schema.org; olhar o console do navegador em busca de avisos de CSP antes de tirar o "Report-Only".

**Em uma frase:** o site está tecnicamente bem feito (HTML estático, leve, schema `School` correto, robots e sitemap certos). O que segura o SEO está **fora do código**: um domínio antigo ainda no ar e o endereço da escola diferente em cada diretório. Dentro do código, o que falta é **dado concreto** (horários, idades, ano de fundação, equipe, resultados), não volume de texto.

---

## 1. Crítico

### 1.1 O domínio antigo `escolaprisma.com` está no ar, indexável e com outro conteúdo
- `https://www.escolaprisma.com/` responde **200**, sem redirecionamento e sem canonical para o `.net.br`. Tem title próprio, CEP 44100-000 (genérico) e Google Analytics próprio (G-RWFY9XPFLC).
- A bio do Instagram ainda aponta para o `.com`.
- **Efeito:** dois "sites oficiais" com dados diferentes concorrem entre si e dividem autoridade. Isso confunde o Google e as IAs sobre qual é o site da escola.
- **Correção** (no provedor do `.com`, não neste repositório):
  1. Fazer redirecionamento 301 de `escolaprisma.com` e `www.escolaprisma.com` para `https://www.escolaprisma.net.br/`.
  2. **Não** redirecionar `pais.escolaprisma.com` (portal dos pais) e **não** mexer nos registros MX: o e-mail `secretaria@escolaprisma.com` continua em uso.
  3. Usar a "Mudança de endereço" no Search Console.
  4. Trocar o link do site no Instagram, no Facebook e no Perfil da Empresa no Google.
- **Como saber se falhou:** `curl -sI https://www.escolaprisma.com/` não retorna `301` com `location: https://www.escolaprisma.net.br/`.

### 1.2 Nome, endereço e telefone divergentes nos diretórios
Os buscadores e as IAs citam a escola **a partir dos diretórios, não do site**. Na busca `escolaprisma.net.br` só aparecem outras escolas "Prisma" do país.

| Fonte | Endereço publicado | E-mail |
|---|---|---|
| Site (`src/data/escola.ts:15`) | Caminho 16 - Tomba (**sem nº e sem conjunto**) | secretaria@escolaprisma.com |
| Correios (CEP 44091-554) | Caminho 16 (Feira VII), Tomba | |
| Site antigo `.com` | Caminho 16, Conjunto Feira VII, 16 - Tomba, CEP **44100-000** | secretaria@escolaprisma.com |
| [Melhor Escola](https://www.melhorescola.com.br/escola/escola-prisma-1) | Quadra C Caminho 16, 16/18 - **Mangabeira** | escolaprisma@**hotmail**.com |
| [escol.as](https://www.escol.as/301177-escola-prisma) (Censo 2024, INEP 29410991) | Rua Comendador Gomes… 16/18 - **Panorama** | escolaprisma@**hotmail**.com |
| [Telelistas](https://www.telelistas.net/ba/feira+de+santana/em+tomba/escolas+particulares) | Caminho 16 Cj Feira VII, 16 - Tomba, mais um **"Colégio Prisma"** no Caminho 14 | |
| Facebook | página chamada "Prisma Feira VII" | |

**Correção:**
1. Definir com a escola **um endereço canônico**, por exemplo "Caminho 16, nº 16, Conjunto Feira VII - Tomba", e usar exatamente esse texto no Perfil no Google, em `escola.ts`, no rodapé, no schema e no `llms.txt`.
2. Corrigir o **Educacenso/INEP** na próxima coleta do Censo Escolar. Ele alimenta escol.as, QEdu e outros sites.
3. Reivindicar a página no Melhor Escola e corrigir. Corrigir o Telelistas e verificar se o "Colégio Prisma" é duplicata.
4. Decidir qual é o e-mail oficial e trocar o hotmail em todos os lugares.

**Como saber se falhou:** em 60–90 dias, a busca `"Escola Prisma" Feira de Santana` (no Google, no ChatGPT e no Perplexity) ainda mostra Mangabeira ou Panorama, ou não traz o link do `.net.br`.

### 1.3 Depoimentos sem comprovação
- `src/content/testimonials/testimonials.json` tem "Mariana" e "Carlos", só o primeiro nome, sem foto e com tom de texto de marketing. A pendência já aparece em `docs/PLANO-DE-CORRECOES.md`.
- **Correção:** trocar por 3 a 5 depoimentos reais e autorizados por escrito, ou mostrar avaliações reais do Google com link para o Perfil. Enquanto isso não acontece, tirar a seção.

---

## 2. Alto

| # | Achado | Evidência | Correção |
|---|---|---|---|
| 2.1 | Faltam as informações que os pais comparam | não há horários, idade mínima, o que o integral inclui, documentos de matrícula, estrutura física nem faixa de preço | Coletar com a escola. Criar o bloco "Como funciona" (tabela por segmento) e incluir as perguntas no FAQ (`faqs.json`) |
| 2.2 | Nenhum horário de funcionamento | nada no site, no schema nem no `llms.txt` | Mostrar o horário da secretaria no rodapé e em `openingHoursSpecification`, igual ao do Perfil no Google |
| 2.3 | "4.9 no Google" e "29 anos" sem fonte | `hero.json:11-12`; `anoFundacao: ''` em `escola.ts:13` | Escrever "4,9 no Google (N avaliações)" com link para o Perfil. Usar "Desde 1997" (o site antigo diz isso; confirmar) e preencher `anoFundacao`. **Não** usar `aggregateRating` próprio |
| 2.4 | Nenhuma pessoa identificada nem dado institucional | nenhum nome de direção ou coordenação, sem CNPJ e sem ato de autorização | Seção "Quem cuida da escola" (nome, cargo, formação, foto). Razão social, CNPJ e credenciamento no rodapé |
| 2.5 | Ensino Médio sem nenhum resultado | `phases.json` promete preparação para o ENEM/UEFS sem números | Publicar a média do ENEM (o Melhor Escola mostra 619,44; confirmar o ano no INEP) e as aprovações autorizadas |
| 2.6 | A escola pode ser confundida com outras "Prisma" | schema sem `identifier`, `alternateName` nem `foundingDate` | Incluir no schema o INEP `29410991` (confirmar), `alternateName` se for usado e `foundingDate` |
| 2.7 | Perfil da Empresa no Google não verificado | o Maps não renderiza por fetch | Conferir categoria "Escola particular" + secundárias reais, horários, descrição citando Tomba/Feira VII, fotos (sem rosto de criança sem autorização), resposta a 100% das avaliações, posts semanais e duplicatas |

## 3. Médio

| # | Achado | Arquivo | Correção |
|---|---|---|---|
| 3.1 | Faltam cabeçalhos de segurança (só tem HSTS) | não existe `vercel.json` | Criar `vercel.json` com `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options` e CSP em modo **Report-Only** primeiro |
| 3.2 | Google Fonts bloqueia a renderização (3 famílias) | `BaseLayout.astro:96-98` | Hospedar as fontes no próprio site (fontes do Astro ou `@fontsource`), cortar os pesos que não são usados e fazer preload da fonte do H1 |
| 3.3 | Imagens do hero com `loading=lazy` acima da dobra no desktop | `Hero.astro:75+` | Usar `loading="eager"`, `fetchpriority="high"` na primeira e `densities={[1,2]}` |
| 3.4 | Feed do Curator sem altura reservada (CLS) | `SocialFeed.astro:22-24` | `#curator-feed { min-height: ~520px }` |
| 3.5 | Página 404 é texto puro da Vercel | não existe `src/pages/404.astro` | Criar a 404 com `BaseLayout`, `noIndex`, link para a home e botão de WhatsApp |
| 3.6 | Schema sem `WebSite`/`WebPage` em `@graph` | `src/utils/schema.ts:13-76` | Grafo School ↔ WebSite ↔ WebPage (código pronto na seção 6) |
| 3.7 | `geo` com 4 casas decimais | `escola.ts:22` | `-12.29491, -38.94568` (vem do mapa embutido; conferir com o pin do Perfil) |
| 3.8 | `telephone` do schema é o WhatsApp, mas o principal visível é o fixo | `schema.ts:25` | Usar o mesmo número principal do Perfil no Google |
| 3.9 | H1 sem "escola" e sem local | `hero.json`, `Hero.astro:42` | Manter a frase de efeito e acrescentar um kicker ou subtítulo "Escola particular no Tomba, Feira de Santana" |
| 3.10 | H2s de marketing que não dizem o assunto | `Phases.astro:28`, `DailyRoutine.astro:15`, `Ecosystem.astro:29`, `FinalCTA.astro:13` | Títulos descritivos com o mesmo tom ("Turno integral: como é o dia do seu filho") |
| 3.11 | Texto repetido e genérico ("nome/número/cuidado" 5 vezes; seções que se sobrepõem) | Manifesto, ProblemSolution, DailyRoutine, Ecosystem | Juntar as seções em "Um dia na Prisma" com horários reais. Trocar frase de efeito por fato |
| 3.12 | Sem fotos da estrutura | só 5 imagens | Galeria de 8 a 12 fotos reais com legenda (quadra, laboratórios, biblioteca, espaço infantil) |
| 3.13 | Matrícula 2027 sem passo a passo | `matriculas.json` | Lista "Como matricular" (visita, documentos, contrato, prazo) |
| 3.14 | Não há link "Como chegar" | só o iframe do mapa em `Footer.astro:36-45` | Botão "Como chegar no Google Maps" ao lado do endereço |
| 3.15 | Quatro links "Saber mais" sem `aria-label` | `Phases.astro` | `aria-label="Saber mais sobre a Educação Infantil pelo WhatsApp"` etc. |

## 4. Baixo

- Telefone fixo escrito direto no código em `TopBar.astro:10,17` e `MobileMenu.astro:21-23`: usar `escola.telefoneFixo`.
- E-mail só aparece no JSON-LD: mostrar como `mailto:` no rodapé ou tirar do schema.
- `url` do schema sem a barra final, diferente da canonical: usar `${escola.site}/`.
- Logo do schema: usar `ImageObject` com `logo-square.png` (512×512).
- Open Graph sem `og:locale`, `og:site_name`, `og:image:width/height/alt`.
- `prefetch: { prefetchAll: true }` é inútil numa página única: remover do `astro.config.mjs`.
- `/assets/*` sem hash no nome e com cache `immutable` de 1 ano: renomear o arquivo a cada troca ou reduzir o cache.
- Sitemap sem `lastmod`: `sitemap({ lastmod: new Date() })`.
- Nomes de imagem com espaço e acento (`Balé 1024 x 1024.webp`): renomear para slug ASCII.
- Link "Powered by Curator.io" sem `rel="nofollow noopener"`.
- Títulos do rodapé em `<h3>` logo depois de um `<h2>` de outra seção: opcional.
- `llms.txt`: incluir INEP, ano de fundação, idades e horários. Não há impacto comprovado; o custo é zero.
- A primeira resposta do FAQ repete a pergunta. As respostas sobre bullying e adaptação são vagas demais.
- Área atendida genérica: citar bairros vizinhos de forma natural, depois de confirmar com a escola.

## 5. O que já está bom
- HTML estático com todo o conteúdo em texto. 75 KB (16 KB comprimido), pouco JS e TTFB de 0,24 a 0,44 s pela Vercel em São Paulo.
- Title e meta description com local e oferta. Canonical, `lang="pt-BR"` e um único H1.
- Redirecionamentos 308 de http→https e sem-www→www. 404 real (não soft 404).
- `robots.txt` liberado (inclusive para os crawlers de IA), sitemap correto e `llms.txt` publicado.
- JSON-LD `School` completo e coerente com o rodapé. Sem `aggregateRating` autoatribuído. FAQPage igual ao FAQ visível (informativo: o Google não mostra mais rich result de FAQ desde maio/2026).
- Fonte única de dados (`src/data/escola.ts`).
- FAQ em `<details>` nativo, com respostas autossuficientes, bom para citação por IA.
- CTAs de WhatsApp com mensagem pré-preenchida por assunto, sem atrito.
- Imagens com `alt`, `width` e `height`. Vídeo do YouTube como fachada leve, mapa lazy, Curator e Clarity carregados depois.

## 6. Schema recomendado (`src/utils/schema.ts`)

Trocar `schoolSchema()` por um `@graph` com School, WebSite e WebPage:

```ts
const HOME = `${escola.site}/`;
const ID_ESCOLA = `${escola.site}/#escola`;
const ID_SITE = `${escola.site}/#website`;

export function siteGraphSchema(): SchemaOrg {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'School',
        '@id': ID_ESCOLA,
        name: escola.nome,
        url: HOME,
        logo: { '@type': 'ImageObject', url: `${escola.site}/assets/logo-square.png`, width: 512, height: 512 },
        image: { '@type': 'ImageObject', '@id': `${escola.site}/#imagem-principal`,
                 url: `${escola.site}/assets/escola-prisma-marca-1200x630.png`, width: 1200, height: 630 },
        // ...demais campos atuais (slogan, description, address, geo, hasMap, areaServed, knowsAbout, contactPoint, sameAs)
        // telephone: o MESMO número principal do Perfil no Google
        // identifier: { '@type': 'PropertyValue', propertyID: 'INEP', value: '29410991' }  // depois de confirmar
        // openingHoursSpecification: [...]                                                 // depois de coletar
        ...(escola.anoFundacao ? { foundingDate: escola.anoFundacao } : {}),
      },
      { '@type': 'WebSite', '@id': ID_SITE, url: HOME, name: escola.nome, inLanguage: 'pt-BR',
        publisher: { '@id': ID_ESCOLA } },
      { '@type': 'WebPage', '@id': `${HOME}#webpage`, url: HOME, inLanguage: 'pt-BR',
        isPartOf: { '@id': ID_SITE }, about: { '@id': ID_ESCOLA },
        primaryImageOfPage: { '@id': `${escola.site}/#imagem-principal` } },
    ],
  };
}
```

Em `src/pages/index.astro`: `const schema = [siteGraphSchema(), faqPageSchema(faqsData)];`

**Como validar:** no validator.schema.org devem aparecer School, WebSite, WebPage e FAQPage, sem erros.

## 7. Falta coletar com a escola (não inventar)
1. Endereço canônico (número, quadra, "Conjunto Feira VII") e telefone principal do Perfil no Google.
2. Horário da secretaria e horários das aulas e do integral.
3. Ano de fundação (provavelmente 1997).
4. Código INEP (29410991?) e e-mail oficial (o `@escolaprisma.com` ou o hotmail?).
5. Idade mínima por segmento, o que o integral inclui e a política de preço ou bolsas.
6. Documentos e etapas da matrícula 2027.
7. Nomes e cargos da direção e das coordenações, CNPJ e razão social, ato de credenciamento.
8. Média do ENEM com o ano, e aprovações autorizadas.
9. Depoimentos reais autorizados e a nota/contagem atual de avaliações no Google.
10. Fotos reais da estrutura.

## 8. Plano de ação

| Fase | Quando | O quê | Onde |
|---|---|---|---|
| 1 | Semana 1 | 301 do `.com` para `.net.br`. Definir o endereço canônico. Revisar o Perfil no Google | fora do código |
| 1 | Semana 1 | Rodar o PageSpeed com chave e conferir os Core Web Vitals no Search Console | pagespeed.web.dev |
| 2 | Semanas 2–3 | Schema em `@graph`, `geo` com 5 casas, telefone, `url` com barra. Fontes no próprio site, hero sem lazy, altura do Curator, 404, `vercel.json` | código |
| 2 | Semanas 2–3 | Corrigir Melhor Escola, Telelistas e Facebook. Cadastrar no Bing Places e no Apple Business Connect | fora do código |
| 3 | Mês 2 | Conteúdo com os dados coletados: horários, idades, equipe, ENEM, matrícula, fotos, depoimentos reais, H1/H2 descritivos | código + escola |
| 3 | Mês 2 | Opcional: páginas `/educacao-infantil`, `/ensino-medio`, `/turno-integral`, `/matriculas-2027` com 500 a 800 palavras reais cada | código |
| 4 | Contínuo | Pedir avaliações e responder a todas. Posts semanais no Perfil. Atualizar o Educacenso. A cada 60–90 dias, repetir as buscas de marca no Google e em IAs | escola |

## Limitações
- Sem números reais de LCP, INP e CLS: o PageSpeed sem chave atingiu a cota, e o Lighthouse local foi bloqueado.
- A busca da ferramenta era voltada aos EUA. Não foi possível ver o pacote local do Google Maps nem o Perfil renderizado.
- Os dados de diretórios (média do ENEM, INEP) vêm de agregadores e precisam ser confirmados.
