# Monitoramento do site

O site usa três ferramentas que se complementam:

| Ferramenta | Responde | Painel |
| --- | --- | --- |
| **Umami** | *Quantos?* Visitas, origem, dispositivos, cliques de conversão | <https://cloud.umami.is> |
| **Microsoft Clarity** | *Como?* Mapas de calor, gravações das sessões, onde as pessoas travam | <https://clarity.microsoft.com> |
| **Google Tag Manager + Analytics** | Integração com Google Ads, Search Console e relatórios do GA4 | <https://tagmanager.google.com> / <https://analytics.google.com> |

Juntas, elas mostram, por exemplo, que o banner teve 200 visualizações e 12 cliques (Umami) e o que as pessoas fizeram antes de clicar ou desistir (Clarity).

---

# Umami

Website ID `531d3b02-006f-478e-896b-36b7a394d576`.

O Umami mede visitas, páginas, origem do tráfego (Google, Instagram, direto), cidade, dispositivo e os **cliques de conversão** abaixo. Não usa cookies, então não exige aviso de cookies (LGPD).

## Instalação

- **Script:** no `<head>` de `src/layouts/BaseLayout.astro`.
- **`data-domains="www.escolaprisma.net.br,escolaprisma.net.br"`:** só conta visitas do site oficial. Visitas em `localhost` e nos previews da Vercel **não** entram nas estatísticas.
  - Se o domínio mudar, atualize esse atributo, senão o Umami para de contar.
- **Eventos de clique:** `src/scripts/analytics.ts`. Ele lê os atributos `data-ga4-event` e `data-ga4-location` que já existem nos botões. Os mesmos eventos também vão para o `dataLayer` do Google Tag Manager (ver seção do Google, no fim).

## Eventos

No painel do Umami: **Events**. Os mesmos eventos vão para o Clarity. Cada evento tem a propriedade `local`, que diz em que parte da página foi o clique.

| Evento | Botão | `local` |
| --- | --- | --- |
| `click_matricula` | Banner de matrículas: "Garanta a vaga do seu filho" (celular: "Garanta a vaga") | `banner_matriculas` |
| `click_agendar_visita` | Hero, banner (secundário) e CTA final | `hero`, `banner_matriculas`, `final_cta` |
| `click_saber_mais_fase` | "Saber mais" das fases de ensino | `infantile`, `fundamental-1`, `fundamental-2`, `medio` |
| `click_conhecer_estrutura` | "Quero conhecer a estrutura" | `ecossistema` |
| `click_falar_coordenacao` | Cabeçalho e menu mobile | conforme o botão |
| `click_faixa_matriculas` | Faixa "Matrículas 2027 abertas" no topo | `faixa_topo` |
| `play_video_rotina` | Play no vídeo da rotina | `rotina` |
| `click_whatsapp_float` | Botão verde flutuante | `global` |
| `click_whatsapp` | Outros links de WhatsApp (Manifesto, rodapé) | id da seção ou `footer` |
| `click_telefone` | Links de telefone fixo (topo, menu, rodapé) | id da seção, `header` ou `footer` |

**Pergunta que o painel responde:** quantas pessoas clicaram para falar no WhatsApp, e a partir de qual parte do site. Por exemplo: o banner de matrículas está funcionando?

## Novo botão com evento

```astro
<a href={whatsappLink("...")} data-ga4-event="click_nome_do_evento" data-ga4-location="nome_da_secao">...</a>
```

Links de WhatsApp e telefone já são contados automaticamente, mesmo sem esses atributos.

## Como testar

1. Publique (ou use o site oficial), abra a página e clique em um botão.
2. No painel do Umami, em **Realtime**, a visita e o evento aparecem em segundos.
3. Bloqueadores de anúncio (uBlock, Brave) podem impedir a contagem. Para testar, use uma aba anônima sem extensões.

---

# Microsoft Clarity

Projeto `zda9hbje8t`. Grátis e sem limite de sessões.

## Instalação

- **Desde 15/11/2026, carregado pelo Google Tag Manager** (`GTM-NRQ8DB4L`, tag "Microsoft Clarity - Official", acionador All Pages). Não há mais script do Clarity no código do site: **não reinstale no `BaseLayout`**, senão ele carrega em dobro.
  - Como o GTM só carrega no domínio oficial, o Clarity também só grava sessões de `escolaprisma.net.br`. Testes em `localhost` e previews da Vercel não geram gravações.
  - Antes (PR #1 a #4) o script ficava no `BaseLayout` e só carregava depois do evento `load`. Pelo GTM ele carrega no ritmo do contêiner; se a nota do Lighthouse cair, troque o acionador da tag para "Janela carregada" (Window Loaded).
  - Para pausar ou remover o Clarity: no GTM, pause a tag e publique o contêiner. Não precisa mexer no código.
- **Eventos:** o mesmo `src/scripts/analytics.ts` envia ao Clarity os eventos da tabela do Umami (`clarity("event", ...)`) e a etiqueta `ultimo_clique_local`.

## O que olhar no painel

- **Heatmaps → Click:** onde as pessoas clicam (inclusive em coisas que não são clicáveis, que viram candidatas a botão).
- **Heatmaps → Scroll:** até onde rolam a página. Mostra quantos chegam ao banner, às fases, à FAQ e ao final.
- **Recordings:** filtre por **Custom events → `click_matricula`** para assistir só às sessões de quem clicou no banner, ou pelo evento contrário para ver quem desistiu.
- **Dashboard → Rage clicks / Dead clicks:** cliques repetidos de frustração ou cliques que não fazem nada. São sinais de algo quebrado ou confuso.

## Privacidade (LGPD)

Diferente do Umami, o **Clarity usa cookies e grava as sessões** (movimento do mouse, rolagem e cliques). O Clarity já mascara automaticamente campos de formulário e textos sensíveis.

- **Recomendado:** citar o Microsoft Clarity na Política de Privacidade da escola. O site ainda não tem uma página de política; vale criar.
- **Banner de cookies:** a LGPD pede base legal para cookies de análise. Se a escola quiser seguir à risca, dá para adicionar um aviso de consentimento e só carregar o Clarity depois do "Aceito", usando `clarity('consent')`. Hoje ele carrega sem pedir consentimento.

## Como testar

1. Com o site publicado, abra-o em uma aba anônima e navegue por um minuto.
2. No Clarity, a sessão aparece em **Recordings** em até ~30 minutos. Mapas de calor podem levar algumas horas.
3. Bloqueadores de anúncio podem impedir o Clarity, assim como o Umami.

---

# Google Tag Manager / Google Analytics

Contêiner `GTM-NRQ8DB4L` (código fornecido pelo Google Analytics em "Configurar uma tag do Google" → "Instalar manualmente"). Instalado em 15/11/2026, substituindo o contêiner anterior `GTM-N4T2LBTX` (14/11/2026), que não deve mais ser usado.

Tags publicadas no contêiner (15/11/2026):

| Tag | Tipo | Acionador | ID |
| --- | --- | --- | --- |
| Google Analytics Novo | Tag do Google (GA4) | Initialization - All Pages | `G-B7C6WH3HK9` (propriedade "Escola Prisma GA4", fluxo "Meu site Escola Prisma", 16338990029) |
| Microsoft Clarity - Official | Microsoft Clarity | All Pages | `zda9hbje8t` |

## Instalação

- **Script:** primeiro item do `<head>` de `src/layouts/BaseLayout.astro`, como o Google pede. Uma única tag do Google por página.
- **Só carrega no domínio oficial** (`escolaprisma.net.br` e subdomínios), e com ele todas as tags do contêiner (GA4 e Clarity). Em `localhost` e nos previews da Vercel o `dataLayer` existe, mas o `gtm.js` não é baixado.
- **CSP:** `vercel.json` libera `www.googletagmanager.com` e os domínios de coleta do GA4 (`*.google-analytics.com`, `*.analytics.google.com`). Se adicionar outras tags no GTM (Meta Pixel, Google Ads etc.), acrescente os domínios delas no CSP.

## Eventos no GTM

`src/scripts/analytics.ts` faz `dataLayer.push({ event: '<nome>', local: '<seção>' })` em todo clique da tabela de eventos do Umami. Para levar ao GA4:

1. **Variáveis → Nova → Variável da camada de dados**, nome `local`.
2. **Acionadores → Novo → Evento personalizado**, nome do evento `^click_|^play_` com "Usar correspondência de regex".
3. **Tags → Nova → Google Analytics: evento do GA4**, nome do evento `{{Event}}`, parâmetro `local` = `{{local}}`, com o acionador acima.
4. No GA4, marque `click_matricula`, `click_agendar_visita` e `click_whatsapp*` como **eventos principais (conversões)**.

A tag do GA4 (`G-B7C6WH3HK9`) já está no contêiner. Publique o contêiner depois de cada alteração.

## Como testar

1. No GTM, clique em **Visualizar** (Tag Assistant) e informe `https://www.escolaprisma.net.br`.
2. Clique em um botão de WhatsApp: o evento `click_whatsapp` deve aparecer na linha do tempo do Tag Assistant.
3. No GA4, **Relatórios → Tempo real** mostra a visita em segundos.

## Privacidade (LGPD)

O GA4 usa cookies. Vale o mesmo do Clarity: citar o Google Analytics na Política de Privacidade e, se a escola quiser seguir à risca, carregar só após consentimento (Consent Mode do Google).
