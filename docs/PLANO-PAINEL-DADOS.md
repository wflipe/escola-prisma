# Plano: dados das ferramentas dentro do painel

Criado em 16/11/2026. Status: **aguardando as chaves de acesso** (Etapa 1, feita pelo dono das contas).

## Objetivo

Ter num só lugar, no painel `/keystatic`, a edição do site **e** os números das ferramentas de medição: quantas pessoas visitam, de onde vêm, o que procuram no Google, quantas clicam no WhatsApp e onde travam na página.

## Como vai ficar

Um novo grupo no menu do painel, **"Resultados"**, com a tela **"Dados do site"**:

| Bloco | O que mostra | De onde vem |
| --- | --- | --- |
| Resumo | Visitantes, visitas, páginas vistas e tempo médio (7, 30 ou 90 dias, com a variação contra o período anterior) | Umami |
| Contatos | Cliques no WhatsApp, no telefone, nos portais e no Instagram, por botão | Umami (eventos que o site já envia) |
| De onde vêm | Google, Instagram, acesso direto, outros sites; celular x computador; cidades | Umami e Google Analytics |
| O que procuram | As buscas do Google que trouxeram visitas, cliques, impressões e posição média | Google Search Console |
| Comportamento | Cliques de raiva, cliques "mortos", rolagem média e link para as gravações | Microsoft Clarity |

Cada bloco tem um link "Abrir na ferramenta" para quem quiser ver mais detalhes.

## Como funciona (técnico)

- A tela "Dados do site" é uma tela do Keystatic que não grava nada no conteúdo (como a caixa "Onde aparece"). Ela busca os números numa rota do próprio site, `/api/painel/dados`, que roda na Vercel.
- **Segurança:** a rota só responde para quem está logado no painel. Ela confere com o GitHub que o usuário tem permissão de edição no repositório `wflipe/escola-prisma`. As chaves das ferramentas ficam só nas variáveis de ambiente da Vercel e nunca chegam ao navegador. Página com `noindex` e sem cache público.
- **Limites:** o Clarity libera 10 consultas por dia e só os últimos 3 dias; a rota guarda a resposta por 3 horas. Umami, Analytics e Search Console são consultados na hora, com cache de 15 minutos.
- Sem custo: todas as APIs usadas são gratuitas nesse volume.
- O site público não muda.

## Etapas

### Etapa 1: gerar as chaves de acesso (dono das contas, ~30 min)

Nenhuma chave deve ser enviada em print ou mensagem: elas vão direto para a Vercel (**Settings → Environment Variables**, tipo **Secret**, só **Production**).

1. **Umami** (cloud.umami.is): *Settings → API keys → Create key*. Variável `UMAMI_API_KEY`. O ID do site (`531d3b02-006f-478e-896b-36b7a394d576`) já está no projeto.
2. **Google (Analytics + Search Console)**, uma conta de serviço serve para os dois:
   1. Em console.cloud.google.com, criar um projeto (ex.: "escola-prisma-painel"), ativar **Google Analytics Data API** e **Google Search Console API**.
   2. *IAM → Contas de serviço → Criar*; depois *Chaves → Adicionar chave → JSON* (baixa um arquivo).
   3. No **Google Analytics** (propriedade "Escola Prisma GA4"): *Administrador → Gerenciamento de acesso → +* com o e-mail da conta de serviço, papel **Leitor**.
   4. No **Search Console** (propriedade do `escolaprisma.net.br`): *Configurações → Usuários e permissões → Adicionar usuário* com o mesmo e-mail, permissão **Restrita**.
   5. Variáveis: `GOOGLE_SERVICE_ACCOUNT_EMAIL` (o e-mail), `GOOGLE_PRIVATE_KEY` (o campo `private_key` do JSON, inteiro) e `GA4_PROPERTY_ID` (número da propriedade, em *Administrador → Detalhes da propriedade*). Depois, apagar o arquivo JSON do computador.
3. **Clarity** (clarity.microsoft.com, projeto `zda9hbje8t`): *Settings → Data Export → Generate new API token*. Variável `CLARITY_API_TOKEN`.
4. **Redeploy** na Vercel.

Dá para começar só com parte das chaves: cada bloco aparece quando a chave dele existir e mostra "não configurado" enquanto isso.

### Etapa 2: rota de dados (`/api/painel/dados`)

Verificação do login, chamadas às 4 APIs, cache e respostas de erro em português. Testes com dados de exemplo no computador.

### Etapa 3: tela "Dados do site"

Grupo "Resultados" no menu, blocos acima, seletor de período, visual no mesmo estilo do painel (claro e escuro, celular). Números formatados em português (1.234; 12,5%).

### Etapa 4: publicação e conferência

PR, conferir no preview, publicar com o "pode publicar" e conferir com o login real. Atualizar o manual (`docs/PAINEL-ADMIN.md`) com a explicação de cada número.

## Riscos

| Risco | Como lidar |
| --- | --- |
| Chave vazada | Ficam só na Vercel; rota exige login com permissão no repositório; troca de chave documentada |
| Ferramenta fora do ar ou limite atingido | O bloco mostra o último dado guardado ou "indisponível agora"; o resto da tela segue funcionando |
| Números diferentes entre Umami e GA4 | Normal (medem de jeitos diferentes; bloqueadores de anúncio afetam o GA4). O manual explica qual usar para quê |
| Mudança nas APIs | Cada ferramenta fica num arquivo separado em `src/painel/dados/`, fácil de ajustar |
