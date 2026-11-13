# WhatsApp: mensagem do site e saudação automática

## Como funciona

São duas mensagens diferentes, cada uma escrita por quem a envia:

| Quem envia | Onde fica | Texto |
| --- | --- | --- |
| **O pai/responsável** (ao clicar em um botão do site) | Código do site: `whatsappLink()` em `src/data/escola.ts` | `Olá! Vim pelo site da Escola Prisma e gostaria de <assunto>.` |
| **A escola** (resposta automática) | App **WhatsApp Business** da escola | `Olá! Que alegria receber seu contato pelo nosso site e saber do seu interesse pela Escola Prisma! 💙✨` |

Assim a conversa fica natural: o pai diz o que quer, e a escola responde com as boas-vindas.

O `<assunto>` muda conforme o botão clicado. A equipe já sabe o interesse do pai na primeira mensagem:

| Botão | Assunto enviado |
| --- | --- |
| Hero ("Agendar Visita") | agendar uma visita guiada |
| Banner de matrículas (principal) | informações sobre as matrículas 2027 |
| Banner de matrículas (secundário) | agendar uma visita antes de fazer a matrícula |
| Fases de ensino | informações sobre vagas para a Educação Infantil / Ensino Fundamental I / Ensino Fundamental II / Ensino Médio |
| Ecossistema | conhecer a estrutura e os diferenciais da escola |
| Manifesto | saber mais sobre a escola |
| Cabeçalho e menu mobile | falar com a Coordenação |
| Botão flutuante | informações sobre matrículas |
| Rodapé | falar com a escola |
| CTA final | agendar uma visita para conhecer a escola pessoalmente |

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
- **Assunto de um botão:** campo `whatsappAssunto` nos JSON de `src/content/site/` (hero, matriculas, phases, ecosystem) ou a chamada `whatsappLink("...")` direto no componente (Header, MobileMenu, Footer, WhatsAppFloat, Manifesto, FinalCTA).
- **Número:** `escola.whatsapp` em `src/data/escola.ts`, que vale para o site inteiro.
