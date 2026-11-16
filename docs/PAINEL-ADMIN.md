# Manual do painel do site

Este manual é para quem vai editar o conteúdo do site da Escola Prisma. Não é preciso saber programar.

## 1. O que é o painel

O painel é uma página com formulários onde você muda os textos, botões, fotos e dados do site.

- Endereço: **https://www.escolaprisma.net.br/keystatic**
- No alto do menu da esquerda aparece **main**: é a versão do site que está no ar. Deixe sempre em `main` e não use o botão **New branch…** (ele cria uma cópia de rascunho que não é publicada).

### O que você precisa

1. Uma conta no **GitHub** (site onde fica guardado o código do site).
2. Permissão de escrita no repositório `wflipe/escola-prisma` (peça ao responsável técnico).
3. **Verificação em duas etapas (2FA)** ligada na sua conta do GitHub. É o código extra pedido no login (por aplicativo ou SMS). Ela é obrigatória: quem entra no painel consegue mudar o site.

### Primeiro acesso

1. Abra https://www.escolaprisma.net.br/keystatic.
2. Clique no botão para entrar com o GitHub ("Log in with GitHub").
3. Entre com seu usuário, senha e código de verificação do GitHub.
4. O GitHub pergunta se você autoriza o aplicativo do painel (**escola-prisma-painel**). Clique em **Authorize** (Autorizar).
5. Você volta para o painel, já logado, numa tela de boas-vindas ("Hello, ...") com todas as telas em botões. Nas próximas vezes o login é mais rápido.

Se aparecer uma página de erro ("Esta página não está funcionando", erro 500) ao clicar em entrar, avise o responsável técnico: é configuração, não algo que você fez (ver a Etapa 3 em [PLANO-PAINEL-ADMIN.md](PLANO-PAINEL-ADMIN.md)).

## 2. Como publicar uma mudança

1. No menu da esquerda, abra a tela que quer mudar.
2. Altere o campo.
3. Clique em **Salvar**, no alto da tela.
4. Pronto. Cada "Salvar" fica registrado no GitHub (com data e autor) e o site é atualizado sozinho em **1 a 2 minutos**.

Não existe botão "Publicar" separado: salvar já publica.

### Como conferir

1. Espere 2 minutos.
2. Abra https://www.escolaprisma.net.br e recarregue a página.
3. Se a mudança não aparecer, abra o site numa **aba anônima** (o navegador às vezes mostra uma cópia antiga). No Chrome: Ctrl+Shift+N no computador, ou menu ⋮ > "Nova guia anônima" no celular.
4. Se depois de 5 minutos ainda não aparecer, veja a seção 5.

Se a tela do painel mostrar um seletor de "branch" (ramo), deixe sempre em **main**. É a versão que vai para o site.

## 3. Botões do painel

O painel está todo em português. Os botões principais:

| Botão | O que faz |
| --- | --- |
| **Salvar** (marrom, no alto) | Salva e publica a tela inteira |
| **Desfazer alterações** (ícone de relógio, no alto; no celular fica no menu ⋯) | Desfaz o que você mudou e ainda não salvou |
| **Adicionar** | Adiciona um item numa lista (pergunta, cartão, etapa…) |
| **Remover** / ícone de lixeira | Apaga um item da lista ou a foto escolhida |
| **Concluir** | Fecha a janela "Editar item" de um item da lista (ainda precisa clicar em Salvar depois) |
| **Cancelar** | Fecha uma janela sem guardar o que mudou |
| **Escolher arquivo** | Escolhe uma foto do seu computador ou celular |
| Alça com pontinhos (⋮⋮) | Segure e arraste para mudar a ordem dos itens |
| **Painel** (primeiro item do menu) | Volta para a página inicial do painel, com todas as telas |

Atenção: **Concluir** não publica nada. Só o **Salvar** publica.

Se aparecer **Não salvo** ao lado do nome da tela, há mudanças que ainda não foram salvas.

### Como cada tela está organizada

- **No alto de cada tela** há uma caixa que diz **onde aquilo aparece no site**, com o link **Ver no site ↗**. Ele abre o site publicado (em outra aba) já na seção certa. Lembre que o site mostra a mudança 1 a 2 minutos depois de salvar.
- Campos que andam juntos ficam **num quadro com título** (ex.: "Botão principal (WhatsApp)", "Endereço", "Faixa fina no topo do site"). No computador, alguns campos curtos ficam lado a lado (ex.: UF, CEP e País; os 3 cartões de foto do Topo); no celular ficam um embaixo do outro.
- O painel segue o tema claro ou escuro do seu aparelho. Dá para trocar no menu da esquerda (ícone de sol/lua ou menu da sua conta).
- As ajudas abaixo de cada campo são curtas; os detalhes estão neste manual.

## 4. As telas do painel

As telas estão em três grupos, na mesma ordem do menu da esquerda. Cada campo tem um limite de letras: se passar, o painel avisa e não deixa salvar. Os limites existem para o texto não quebrar o visual no celular.

### Regras que valem para várias telas

- **Trecho em destaque no título:** parte do título que aparece em itálico colorido (dourado no topo). Escreva **exatamente igual** ao que está no título, com as mesmas letras maiúsculas e acentos. Se não bater, o destaque simplesmente não aparece. Pode deixar vazio.
- **Título com quebra de linha:** em alguns títulos, aperte Enter para quebrar a linha. A quebra vale no computador; no celular o texto se ajusta sozinho.
- **Assunto da mensagem no WhatsApp:** todo botão de WhatsApp manda a frase "Olá! Vim pelo site da Escola Prisma e gostaria de **___**." O campo preenche só o espaço. Comece com letra minúscula e não ponha ponto final. Exemplo: `agendar uma visita guiada`.
- **Ícones e cores:** escolha numa lista. Não dá para enviar ícones novos.
- **Listas:** use **Adicionar** para incluir, a lixeira para apagar e a alça para arrastar e reordenar. Cada lista tem um mínimo e um máximo de itens, escritos na ajuda do campo; fora disso o painel não salva. Nos cartões das seções A Escola e Valores, a cor muda conforme a posição (1º, 2º e 3º cartão) e se repete a partir do 4º; no computador ficam 3 por linha, então use 3 ou 6 cartões.

### Grupo "Topo da página"

**Topo (Hero)** — a primeira parte do site, com o título grande.
- Selo acima do título, título principal (até 90 letras), palavra em destaque (itálico dourado), texto abaixo do título e o botão do WhatsApp.
- Indicadores de confiança: frases curtas abaixo do botão (ex.: "4.9 no Google"). Até 3. Sem nenhum, a linha com a estrela não aparece.
- Cartões de foto: os 3 cartões inclinados ao lado do título. Para cada um: nome, estrela dourada (sim/não), frase curta (aparece em maiúsculas), foto e descrição da foto.
- **Fotos:**
  - Use foto **.webp**, quadrada, com cerca de **1024 x 1024 px** e até uns 200 KB. O site reduz sozinho. Fotos **.jpg**, **.png** e **.avif** também servem.
  - Não são aceitas fotos **.gif** nem **.heic** (formato padrão do iPhone). O painel avisa e não usa o arquivo: converta para .jpg ou .webp antes (no iPhone, Ajustes > Câmera > Formatos > "Mais compatível" já tira as fotos em .jpg).
  - O painel guarda a foto com o nome do arquivo mais um código no final (ex.: `bale-2027.webp` vira `bale-2027-mi0k3x2a.webp`). Assim uma foto nova **nunca substitui** outra foto do site, mesmo que os arquivos tenham o mesmo nome.
  - Ao trocar a foto de um cartão, a foto antiga é **apagada** do projeto. Guarde uma cópia se quiser usar de novo.
  - "Descrição da foto" é lida por pessoas cegas e pelo Google. Descreva a foto (ex.: "Aluna do Balé Prisma").

**Matrículas** — o banner colorido logo abaixo do topo e a faixa fina no alto do site.
- "Mostrar o banner de matrículas": desmarcado, esconde o banner **e** a faixa fina, sem apagar os textos.
- Selo, título, trecho em destaque (ex.: o ano), texto e as etapas com vagas (de 1 a 6).
- Botão principal: tem também um "texto curto" opcional, usado no celular.
- Botão secundário: pode ser escondido com "Mostrar o botão secundário".
- Observação abaixo dos botões (opcional).
- Faixa fina no topo: liga/desliga, texto, chamada (computador) e chamada curta (celular). O "Link da faixa" normalmente fica `/#matriculas` (leva ao banner); precisa começar com `/`, `#` ou `https://`. Só funciona se o banner também estiver ligado.

### Grupo "Seções da página"

**Seções: ordem e visibilidade** — controla quais seções aparecem e em que ordem.
- Arraste para mudar a ordem. O Topo e o banner de Matrículas ficam sempre no início.
- Desmarque "Mostrar esta seção" para esconder. Os textos ficam guardados.
- Seção escondida **some também do menu** sozinha (A Escola, Fases, Diferenciais, Famílias, Dúvidas).
- Se a mesma seção aparecer duas vezes, só a primeira vale. A repetida é ignorada.
- Se você apagar uma seção da lista, ela fica escondida. Para trazer de volta, use **Adicionar** e escolha a seção.
- "Mostrar depoimentos": liga o bloco "O que dizem as famílias". Só marque com depoimentos reais e autorizados.

**A Escola (proposta)** — primeira seção depois do banner. Frase acima do título, título, destaque, texto e cartões (ícone, título, texto; de 1 a 6, o ideal são 3 ou 6).

**Manifesto** — frase acima do título, título, destaque, texto e botão do WhatsApp.

**Valores cristãos** — selo, título, destaque, texto e cartões (ícone, título, texto; de 1 a 6, o ideal são 3 ou 6).

**Rotina e vídeo** — título, texto, itens da rotina (de 1 a 5; o ideal são 3) e o vídeo.
- "Vídeo (ID do YouTube)": é o código de 11 letras do link. Em `youtube.com/watch?v=qYuossXmZfc`, o ID é `qYuossXmZfc`.
- Título do vídeo e descrição da capa: lidos por pessoas cegas e pelo Google.

**Fases de ensino** — os cartões das etapas (Educação Infantil, Fundamental I…).
- Frase acima do título, título, destaque, texto e a frase em itálico abaixo dos cartões.
- Cada etapa: nome, identificador, rótulo da fase (texto pequeno do cartão, ex.: "1ª Descobrir"), ícone, cor do cartão, descrição, texto do botão e assunto do WhatsApp.
- "Identificador": uso interno. Só letras minúsculas, números e hífen (ex.: `fundamental-1`). Não mude sem necessidade.

**Diferenciais** — título, destaque, texto, botão (texto e assunto do WhatsApp) e a lista de diferenciais (ícone, título, descrição; de 1 a 8).

**Famílias: por que a Prisma** — título, texto e os motivos (ícone, título, descrição; de 1 a 6).

**Famílias: depoimentos** — título, texto e os depoimentos (inicial no círculo, nome, quem é, depoimento; de 1 a 6, ficam 2 por linha no computador).
- O bloco só aparece no site se "Mostrar depoimentos" estiver marcado em "Seções: ordem e visibilidade".

**Dúvidas (perguntas frequentes)** — título e as perguntas com respostas.
- As respostas também vão para o Google. Escreva frases completas.
- Precisa ter pelo menos uma pergunta. Para tirar a seção do site, esconda em "Seções: ordem e visibilidade".

**Instagram** — título, destaque e texto. O @ e o link do perfil vêm de "Dados da escola".

**Chamada final (visita)** — última seção antes do rodapé: título, destaque, texto, botão do WhatsApp, texto abaixo do botão e a linha pequena do final.

### Grupo "Site todo"

**Menu e rodapé**
- Itens do menu (até 6): texto e a seção para onde leva. Se a seção estiver escondida, o item some sozinho. Na página "não encontrada" (404), os mesmos itens levam de volta à página inicial, na seção escolhida.
- Botão "Fale Conosco" (topo e menu do celular): texto e assunto do WhatsApp.
- Links do portal dos pais e do portal do aluno (barra azul do topo e menu do celular): texto e endereço completo, começando com `https://`.
- Botão redondo do WhatsApp (canto da tela): o nome (lido por pessoas cegas) e o assunto.
- Rodapé: títulos das colunas, texto depois de cada telefone, assunto do WhatsApp, nome do mapa, link do mapa e linha de direitos (depois do ©).
- Link do mapa: no Google Maps, clique em Compartilhar > Incorporar um mapa e copie só o endereço que está dentro de `src="..."`. Ele começa com `https://www.google.com/maps/embed?pb=`.

**Página não encontrada (404)** — página que aparece quando alguém abre um endereço que não existe. Título da aba, descrição, título, texto, botão de voltar ao início e botão do WhatsApp.

**Dados da escola** — nome, slogan (aparece no rodapé e no Google), ano de fundação, endereço, coordenadas, link do mapa, telefones, WhatsApp, e-mail, Instagram e Facebook.
- Esses dados aparecem no rodapé, nos botões e no Google. Devem ser **idênticos ao Perfil da Escola no Google** (Google Meu Negócio). Se mudar um, mude o outro.
- Ano de fundação: só preencha com o ano confirmado. Vazio = não aparece.
- CEP no formato `00000-000`. UF (estado) e País com 2 letras (`BA`, `BR`).
- Coordenadas (latitude e longitude): números com ponto, com **5 a 7 casas decimais** (ex.: `-12.29491`). Copie do mesmo ponto do Perfil no Google. Zeros no final podem sumir ao salvar (`-12.29000` fica `-12.29` no arquivo); o painel mostra de novo com 5 casas e o valor é o mesmo.
- Telefones: "Como aparece no site" é livre, ex.: `(75) 3622-9180`. "Formato internacional" é `+55` seguido só de números, ex.: `+557536229180`.
- WhatsApp "Número para o link": só números, com 55 e DDD, ex.: `5575998954848`. Se errar aqui, **todos** os botões de WhatsApp param de funcionar.
- O endereço do site (domínio) não aparece no painel, de propósito.

**SEO e compartilhamento** — como o site aparece no Google e quando o link é enviado no WhatsApp ou redes sociais.
- Título (ideal: até 60 letras) e descrição (ideal: de 120 a 160 letras).
- Imagem de compartilhamento: é o **caminho** de uma imagem que já existe no site, começando com `/`. Hoje: `/assets/escola-prisma-marca-1200x630.png`. Se o caminho não existir, a publicação falha (o site no ar continua como estava). Para trocar a imagem, fale com o responsável técnico.
- Descrição da escola e temas (de 1 a 20): não aparecem na página. Vão para o Google e para ferramentas de inteligência artificial. Só fatos confirmados.
- O resumo para IAs (`/llms.txt`) usa sozinho os "Dados da escola" e o selo de Matrículas: não é preciso mexer nele.

## 5. Problemas comuns

### O painel não salva

Algum campo tem erro. Procure a **mensagem em vermelho** abaixo do campo. Exemplos:
- Texto maior que o limite.
- Campo obrigatório vazio.
- Formato errado (CEP, telefone, coordenadas, ID do YouTube, link do mapa, link da faixa de matrículas).
- Lista com itens de menos ou de mais (ex.: nenhuma etapa de matrícula, mais de 3 indicadores no Topo).

Corrija e clique em **Salvar** de novo. Se a lista estiver fechada, abra os itens para achar o erro.

### Salvei, mas o site não mudou

1. Espere 2 minutos e recarregue. Tente numa aba anônima.
2. Se depois de 5 minutos nada mudou, a publicação provavelmente falhou. O site no ar **continua como estava**, nada quebra.
3. Avise o responsável técnico dizendo **o que você mudou e a que horas**. Ele vê o motivo na Vercel (serviço que publica o site).
4. Causas mais comuns: foto de um cartão do Topo que não existe mais, ou caminho da imagem de compartilhamento errado.

### Mudei algo errado

Se ainda **não salvou**: clique em **Desfazer alterações** (ícone de relógio).

Se **já salvou**: corrija no painel e salve de novo. É o jeito mais rápido. Se não lembrar como estava, veja a seção 6.

## 6. Como desfazer uma mudança

Toda mudança salva fica guardada no GitHub. Dá para ver como estava antes.

### Ver o texto antigo e corrigir pelo painel

1. Entre em https://github.com/wflipe/escola-prisma.
2. Abra a pasta `src/content/site` (ou `src/content/faqs` para Dúvidas, `src/content/testimonials` para depoimentos).
3. Clique no arquivo da tela (ex.: `hero.json` é o Topo, `matriculas.json` é Matrículas).
4. Clique em **History** (Histórico), no alto, à direita.
5. Clique na mudança anterior à sua. As linhas em vermelho mostram o texto antigo.
6. Copie o texto antigo, cole no painel e clique em **Salvar**.

### Pedir ao responsável técnico

Se a mudança for grande ou envolver fotos, peça ao responsável técnico para **reverter** a alteração (desfazer pelo histórico). Diga a tela, o dia e a hora.

> Para o responsável técnico: existe o ponto de restauração `restauracao/2026-11-15-antes-do-painel`, com o site como estava antes do painel. Passo a passo em [RESTAURACAO.md](RESTAURACAO.md). Na Vercel também dá para voltar um deploy anterior ("Instant Rollback") sem mexer no código.

## 7. O que NÃO está no painel

Estas coisas só mudam com o responsável técnico, porque mexer nelas pode quebrar o site:

- Cores, fontes e o visual (layout) das seções.
- Cores fixas dos cartões das seções A Escola e Valores (seguem a posição) e a posição dos 3 cartões de foto do Topo.
- Ícones novos (só dá para escolher os que já existem).
- A frase base do WhatsApp: "Olá! Vim pelo site da Escola Prisma e gostaria de ___." (o painel muda só o assunto). A resposta automática fica no aplicativo WhatsApp Business, ver [WHATSAPP-SAUDACAO.md](WHATSAPP-SAUDACAO.md).
- Scripts de análise de visitas (Google Tag Manager, Google Analytics, Clarity).
- Rótulos técnicos de acessibilidade, como "Abrir menu de navegação" e "Voltar ao topo".
- O endereço do site (domínio).
- A imagem de compartilhamento em si (o painel só escolhe o caminho de uma imagem que já existe).
- Páginas novas.

## 8. Boas práticas

1. **Uma mudança por vez.** Salve, confira no site, depois faça a próxima.
2. **Confira no celular.** A maioria das famílias acessa pelo celular.
3. **Não coloque dados pessoais de alunos** (nome completo, turma, foto com rosto sem autorização).
4. **Depoimentos só com autorização** por escrito da família, com o texto exato que será publicado.
5. **Dados oficiais iguais ao Google.** Ao mudar telefone ou endereço, atualize também o Perfil da Escola no Google.
6. **Fotos leves:** .webp (ou .jpg), cerca de 1024 px.
7. **Em dúvida, pergunte** ao responsável técnico antes de salvar.
