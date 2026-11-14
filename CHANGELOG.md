# Histórico de versões

Mudanças relevantes do site, da mais recente para a mais antiga.
Pontos de restauração (tags `restauracao/*`) estão em [docs/RESTAURACAO.md](docs/RESTAURACAO.md).

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
