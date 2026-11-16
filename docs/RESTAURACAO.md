# Pontos de restauração (versões salvas)

Cada ponto de restauração é uma **tag do Git**: um "marcador" com nome fixo em uma versão do projeto. É possível voltar a qualquer um deles a qualquer momento.

## Pontos existentes

| Tag | Data | Descrição |
| --- | --- | --- |
| `restauracao/2026-11-13-antes-das-correcoes` | 13/11/2026 | Site como estava antes das correções (commit `83f8a12`, igual à `main` daquela data). |
| `restauracao/2026-11-13-correcoes-e-banner` | 13/11/2026 | Correções das etapas 1–4, dados oficiais centralizados, WhatsApp padronizado, novo vídeo, banner "Matrículas 2027 abertas" e projeto organizado. |
| `restauracao/2026-11-13-publicacao-textos-revisados` | 13/11/2026 | Versão publicada com o PR #1: SEO/GEO e domínio .net.br, Umami e Clarity, faixa no topo, capa do vídeo e textos revisados. |
| `restauracao/2026-11-14-seo-auditoria-tecnica` | 14/11/2026 | Versão publicada com o PR #3: correções de código da auditoria de SEO (schema em grafo, fontes no próprio site, 404, `vercel.json`, hero e feed) e tag do Google Tag Manager. Inclui o PR #2 (depoimentos ocultos). |
| `restauracao/2026-11-15-antes-do-painel` | 15/11/2026 | Site como estava antes do painel de edição (`/keystatic`): commit `3c05aea`, igual à `main` com os PRs #4 a #6 (GTM `GTM-NRQ8DB4L`, Clarity só pelo GTM, etapas do banner empilhadas no celular). Enviada ao GitHub em 15/11/2026. |

Ver todos: `git tag -l "restauracao/*" -n1`

> Para voltar a um commit sem tag, use o número dele no lugar do nome da tag, por exemplo `git switch --detach 1cfd751`. As mudanças de cada versão estão no [CHANGELOG.md](../CHANGELOG.md).
>
> As tags acima já foram enviadas ao GitHub (13/11/2026). Tags novas só existem neste computador até rodar `git push origin --tags`. A `restauracao/2026-11-15-antes-do-painel` foi enviada em 15/11/2026.

## Como voltar para um ponto

### 1. Só olhar ou testar uma versão antiga (sem apagar nada)

```sh
git switch --detach restauracao/2026-11-13-antes-das-correcoes
npm install
npm run dev
# para voltar ao trabalho atual:
git switch -
```

### 2. Criar uma branch a partir do ponto (para corrigir algo nele)

```sh
git switch -c volta-ao-ponto restauracao/2026-11-13-correcoes-e-banner
```

### 3. Publicar no site uma versão antiga (desfazer na `main`)

O caminho seguro é **reverter**, criando um commit novo que desfaz as mudanças, sem apagar o histórico:

```sh
git switch main
git revert --no-edit restauracao/2026-11-13-antes-das-correcoes..HEAD   # desfaz tudo o que veio depois do ponto
git push                                    # a Vercel publica sozinha
```

Atalho pela Vercel, sem Git: em **Vercel → Projeto → Deployments**, abra um deploy antigo e use **"Promote to Production"** (ou "Instant Rollback"). O site volta na hora e o código no GitHub não muda.

> Evite `git reset --hard` + `git push --force` na `main`: apaga o histórico para todo mundo.

### 4. Recuperar só um arquivo de um ponto

```sh
git restore --source restauracao/2026-11-13-antes-das-correcoes -- src/components/sections/Hero.astro
```

## Como criar um novo ponto

Depois de fazer commit das mudanças:

```sh
git tag -a restauracao/AAAA-MM-DD-descricao -m "O que esta versão contém"
git push origin restauracao/AAAA-MM-DD-descricao   # envia ao GitHub (cópia de segurança)
```

Depois, acrescente uma linha na tabela "Pontos existentes" acima.

> Enquanto a tag não for enviada ao GitHub (`git push origin <tag>`), ela existe **só neste computador**.
