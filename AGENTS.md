# Regras do projeto (Escola Prisma)

Site institucional em Astro 7 + painel Keystatic em `/keystatic`. Visão geral, estrutura e comandos: [README.md](README.md). Histórico: [CHANGELOG.md](CHANGELOG.md).

## Idioma e público

- Responda e documente **em português**. O dono do projeto não é programador: explique em linguagem simples.
- Planos e documentos ficam **no repositório** (`docs/`), não em arquivos soltos fora dele.

## Domínio e dados

- Domínio oficial: **https://www.escolaprisma.net.br**. `escolaprisma.com` é outro site, antigo: nunca use.
- Dados da escola (endereço, telefones, coordenadas…) só em `src/content/site/escola.json`. Não invente dados.

## Windows (este computador)

- Rode `npm run dev` / `npm run build` com o caminho em **`D:\` maiúsculo** (`Set-Location "D:\Downloads\..."`; no Git Bash `cd /D/...`). Com `d:` minúsculo o build sai sem CSS e `.vercel/` ganha links em loop.
- O Astro detecta agentes (variáveis `AI_AGENT` / `CLAUDECODE`) e passa a rodar o `astro dev` em segundo plano com limite de 30 s, que estoura aqui (o servidor leva ~20 s ou mais). Para subir o servidor, remova essas variáveis no comando (`Remove-Item env:AI_AGENT, env:CLAUDECODE`) e rode `npx astro dev --port 4330` como processo em segundo plano da ferramenta.
- Depois de puxar mudanças no `package-lock.json`, rode `npm ci` (o `node_modules` local pode ficar com versões antigas e o build sair diferente da produção).
- `npm run preview` não funciona (adapter da Vercel). Saída estática em `dist/client/`.

## Conteúdo e painel

- O painel grava os JSON de `src/content/` como `JSON.stringify(dados, null, 2)` e apaga chaves que não estão na tela. Não mude o formato nem a ordem das chaves dos JSON sem mudar `keystatic.config.ts` junto; teste a ida e volta (abrir, salvar, desfazer: o arquivo deve voltar idêntico).
- O visual do painel fica só em `public/painel/painel.css` (injetado por `src/middleware.ts` em `/keystatic*`). Ele troca variáveis `--kui-*` do Keystar UI; mantenha contraste AA e refaça as contas do cabeçalho do arquivo ao mudar cores.
- O Tailwind do site lê os arquivos de texto do projeto (`keystatic.config.ts`, `README.md`, este arquivo, docs…): uma palavra solta que seja nome de classe do Tailwind (de posição, de display etc.) faz a classe entrar no CSS do site. Depois de editar texto, compare o CSS do build com o do site no ar.

## Segredos

- Nunca mostre, peça ou faça commit de `.env`, client secret do GitHub App ou `KEYSTATIC_SECRET`. Variáveis de produção ficam na Vercel (só Production; `PUBLIC_*` como tipo Config).

## Publicação

1. Branch a partir da `main` → `npm run check` (0 erros) → `npm run build`.
2. Antes de publicar, confira que `dist/client/index.html`, `404.html` e `llms.txt` só mudaram no que era esperado (compare com o site no ar).
3. Commit + PR. **Merge só com o "pode publicar" do dono.** Depois do merge, confira em produção.
4. Em marcos, ponto de restauração (tag) conforme [docs/RESTAURACAO.md](docs/RESTAURACAO.md) e registro no CHANGELOG.

## Documentação do Astro

https://docs.astro.build — antes de mexer em rotas/middleware, componentes, conteúdo ou estilos, consulte o guia correspondente:
[rotas](https://docs.astro.build/en/guides/routing/) ·
[componentes](https://docs.astro.build/en/basics/astro-components/) ·
[frameworks](https://docs.astro.build/en/guides/framework-components/) ·
[conteúdo](https://docs.astro.build/en/guides/content-collections/) ·
[estilos](https://docs.astro.build/en/guides/styling/)
