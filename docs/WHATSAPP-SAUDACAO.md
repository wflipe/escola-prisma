# WhatsApp: mensagem do site e saudação automática

## Como funciona

São duas mensagens diferentes, cada uma escrita por quem a envia:

| Quem envia | Onde fica | Texto |
| --- | --- | --- |
| **O pai/responsável** (ao clicar em um botão do site) | Frase base no código (`whatsappLink()` em `src/data/escola.ts`); o `<assunto>` vem do painel | `Olá! Vim pelo site da Escola Prisma e gostaria de <assunto>.` |
| **A escola** (resposta automática) | App **WhatsApp Business** da escola | `Olá! Que alegria receber seu contato pelo nosso site e saber do seu interesse pela Escola Prisma! 💙✨` |

Assim a conversa fica natural: o pai diz o que quer, e a escola responde com as boas-vindas.

O `<assunto>` muda conforme o botão clicado. A equipe já sabe o interesse do pai na primeira mensagem.

Cada assunto vem de um campo `whatsappAssunto` (no painel: "Assunto da mensagem no WhatsApp"), editável em `/keystatic`. Valores em 15/11/2026:

| Botão | Tela do painel (arquivo) | Assunto enviado |
| --- | --- | --- |
| Hero ("Agendar Visita") | Topo (Hero) (`hero.json`, `primaryCTA`) | agendar uma visita guiada |
| Banner de matrículas (principal) | Matrículas (`matriculas.json`, `cta`) | informações sobre as matrículas 2027 |
| Banner de matrículas (secundário) | Matrículas (`matriculas.json`, `ctaSecundario`) | agendar uma visita antes de fazer a matrícula |
| Fases de ensino (um por etapa) | Fases de ensino (`phases.json`, cada item) | informações sobre vagas para a Educação Infantil / o Ensino Fundamental I / o Ensino Fundamental II / o Ensino Médio |
| Diferenciais | Diferenciais (`ecosystem.json`) | conhecer a estrutura e os diferenciais da escola |
| Manifesto | Manifesto (`secao-manifesto.json`, `botao`) | saber mais sobre a escola |
| Cabeçalho e menu do celular ("Fale Conosco") | Menu e rodapé (`menu-rodape.json`, `botaoContato`) | falar com a Coordenação |
| Botão flutuante | Menu e rodapé (`menu-rodape.json`, `botaoFlutuante`) | informações sobre matrículas |
| Rodapé | Menu e rodapé (`menu-rodape.json`, `rodape`) | falar com a escola |
| Chamada final | Chamada final (`secao-chamada-final.json`, `botao`) | agendar uma visita para conhecer a escola pessoalmente |
| Página 404 | Página não encontrada (`pagina-404.json`, `botaoWhatsapp`) | tirar uma dúvida |

Se alguém mudar um assunto no painel, esta tabela fica desatualizada: o valor que vale é o do JSON.

## Configurar a saudação automática (WhatsApp Business)

No celular com o WhatsApp Business do número (75) 99895-4848:

1. **Configurações** → **Ferramentas comerciais** → **Mensagem de saudação**.
2. Ativar **Enviar mensagem de saudação**.
3. Em **Mensagem de saudação**, colar:

   ```
   Olá! Que alegria receber seu contato pelo nosso site e saber do seu interesse pela Escola Prisma! 💙✨
   ```

4. Em **Destinatários**, escolher **Todos** (ou "Todos que não estão no catálogo de endereços", para não enviar a pais que já são contatos).
5. Salvar.

> O WhatsApp só envia a saudação quando o contato escreve pela primeira vez ou depois de 14 dias sem conversa. Pais que conversam com frequência não recebem a saudação a cada mensagem.

**Dica:** configure também a **Mensagem de ausência** (mesmo menu) para fora do horário de atendimento, por exemplo: "Recebemos sua mensagem! Nosso atendimento é de segunda a sexta. Responderemos assim que possível. 💙"

## Como mudar os textos do site

- **Frase base** (para todos os botões): função `whatsappLink()` em `src/data/escola.ts`.
- **Assunto de um botão:** campo `whatsappAssunto` nos JSON de `src/content/` (todos editáveis no painel `/keystatic`): hero, matriculas, phases, ecosystem, secao-manifesto, secao-chamada-final, pagina-404 e menu-rodape (botão "Fale Conosco" do topo e do menu do celular, link do rodapé e botão flutuante). Nenhum assunto fica mais escrito direto nos componentes.
- **Número:** `whatsapp` em `src/content/site/escola.json`, que vale para o site inteiro.
