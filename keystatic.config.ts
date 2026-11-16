/**
 * Painel de edição do site (Keystatic), aberto em /keystatic.
 *
 * Cada tela (singleton) edita um JSON de src/content/**. Os campos seguem
 * EXATAMENTE o formato desses arquivos (ver src/types/content.ts): mesmas
 * chaves, na mesma ordem, para que salvar sem mudar nada não altere o arquivo.
 *
 * Regras do Keystatic que afetam o formato gravado:
 * - O arquivo é gravado com JSON.stringify(dados, null, 2) + quebra de linha.
 * - Campo de texto vazio é omitido do JSON (por isso campos opcionais, como
 *   headlineHighlight, textCurto e anoFundacao, somem do arquivo quando vazios).
 * - Chaves do JSON que não estão na tela são APAGADAS ao salvar. Para manter uma
 *   chave fora do painel, use fields.ignored() (ex.: "site" em Dados da escola).
 *
 * Três campos daqui são "embrulhos" de campos do Keystatic, para manter o JSON
 * no formato que o site já usa (ver as funções abaixo): campoCoordenada,
 * caixaMostrar e campoImagem.
 *
 * Armazenamento: no computador (npm run dev) grava direto nos arquivos; no
 * site publicado grava no GitHub (cada "Salvar" vira um commit). O login pelo
 * GitHub depende do GitHub App e das variáveis de ambiente da Etapa 3 de
 * docs/PLANO-PAINEL-ADMIN.md.
 */
import { createElement } from 'react';
import { config, fields, singleton } from '@keystatic/core';
import type { SecaoId } from './src/types/content';
import { ancoraDaSecao, nomeDaSecao } from './src/data/nomes-secoes';

// ---------------------------------------------------------------------------
// Opções compartilhadas
// ---------------------------------------------------------------------------

/** Ícones existentes em src/components/ui/Icon.astro (sem as setas de navegação). */
const opcoesIcone = [
  { label: 'Estrela', value: 'star' },
  { label: 'Calendário', value: 'calendar' },
  { label: 'Coração', value: 'heart' },
  { label: 'Livro aberto', value: 'book-open' },
  { label: 'Frasco (ciência)', value: 'flask' },
  { label: 'Capelo (formatura)', value: 'graduation-cap' },
  { label: 'Idiomas', value: 'language' },
  { label: 'Pessoas (cuidado com a criança)', value: 'hands-holding-child' },
  { label: 'Bola (esporte)', value: 'volleyball' },
  { label: 'Balança (equilíbrio)', value: 'scale-balanced' },
  { label: 'Balões de conversa', value: 'comments' },
  { label: 'Caminho (trajetória)', value: 'route' },
  { label: 'Pessoas', value: 'users' },
  { label: 'Pessoa com visto', value: 'user-check' },
  { label: 'Escudo (segurança)', value: 'shield-halved' },
  { label: 'Relógio', value: 'clock' },
  { label: 'Movimento (atividade)', value: 'person-running' },
  { label: 'Cadeado aberto', value: 'unlock-keyhole' },
  { label: 'Aspas (citação)', value: 'quote-left' },
  { label: 'Telefone', value: 'phone' },
  { label: 'Marcador de local', value: 'location-dot' },
  { label: 'Pino de mapa', value: 'map-pin' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Instagram', value: 'instagram' },
] as const;

const ordemDasSecoes: SecaoId[] = [
  'ProblemSolution',
  'Manifesto',
  'ChristianValues',
  'DailyRoutine',
  'Phases',
  'Ecosystem',
  'SocialProof',
  'FAQ',
  'SocialFeed',
  'FinalCTA',
];

/** Todas as seções (tela "Seções: ordem e visibilidade"). */
const opcoesSecao = ordemDasSecoes.map((secao) => ({ label: nomeDaSecao[secao], value: secao }));

/** Só as seções que têm âncora (#id) e podem ser destino de um item do menu. */
const opcoesSecaoDoMenu = ordemDasSecoes
  .filter((secao) => ancoraDaSecao[secao])
  .map((secao) => ({ label: nomeDaSecao[secao], value: secao }));

const ajudaWhatsapp =
  'Completa a frase "Olá! Vim pelo site da Escola Prisma e gostaria de ___". Comece com minúscula, sem ponto final.';

const ajudaDestaque = 'Opcional. Trecho do título em itálico colorido: copie igualzinho ao que está no título.';

const ajudaTituloComQuebra = 'Enter quebra a linha no computador (no celular o texto se ajusta sozinho).';

// ---------------------------------------------------------------------------
// Visual do painel (não gravam nada no JSON)
// ---------------------------------------------------------------------------

const SITE = 'https://www.escolaprisma.net.br';

/**
 * Logo da escola no topo do menu do painel. O quadrado branco por trás mantém o
 * logo (azul-marinho, amarelo e laranja) legível no tema claro e no escuro.
 */
function LogoDoPainel() {
  return createElement('img', {
    src: '/assets/logo-square.webp',
    alt: '',
    width: 28,
    height: 28,
    // Estilo em public/painel/painel.css. Evite escrever aqui palavras que sejam classes do
    // Tailwind (o Tailwind do site lê este arquivo e incluiria a classe no CSS do site).
    className: 'painel-logo',
  });
}

/**
 * Bloco do início de cada tela: diz onde o conteúdo aparece e leva ao site publicado.
 * É um fields.empty() com outra aparência: não lê nem grava nada (a chave nunca
 * entra no JSON), então o formato dos arquivos de src/content não muda.
 * Estilo em public/painel/painel.css (.painel-onde).
 */
function ondeAparece(texto: string, caminho = '/') {
  return {
    ...fields.empty(),
    label: 'Onde aparece',
    Input: () =>
      createElement(
        'p',
        { className: 'painel-onde' },
        createElement('span', null, texto),
        createElement(
          'a',
          { href: `${SITE}${caminho}`, target: '_blank', rel: 'noopener noreferrer' },
          'Ver no site ↗',
          createElement('span', { className: 'painel-leitor-de-tela' }, ' (abre em nova aba)'),
        ),
      ),
  } as ReturnType<typeof fields.empty>;
}

/** Caminho "/#ancora" de uma seção (ou "/" se a seção não tiver âncora). */
const naPagina = (secao: SecaoId) => (ancoraDaSecao[secao] ? `/#${ancoraDaSecao[secao]}` : '/');

// ---------------------------------------------------------------------------
// Campos "embrulhados" (mantêm o formato atual do JSON)
// ---------------------------------------------------------------------------

/**
 * Latitude/longitude: o campo de número do Keystatic arredonda para 3 casas ao
 * salvar. Este campo mostra um texto (sem arredondar, com validação de 5 a 7
 * casas) e grava NÚMERO no JSON, como o site e o schema já usam.
 *
 * O número gravado perde zeros do fim (-12.29000 vira -12.29). Por isso, na
 * leitura, um número com menos de 5 casas volta a ter 5 (-12.29 → "-12.29000"):
 * o que o painel grava sempre é relido como válido e a tela continua salvável.
 */
function campoCoordenada(label: string, limite: number) {
  const base = fields.text({
    label,
    description: 'Com ponto e de 5 a 7 casas decimais. Ex.: -12.29491',
    validation: {
      isRequired: true,
      pattern: { regex: /^-?\d{1,3}\.\d{5,7}$/, message: 'Use ponto e de 5 a 7 casas decimais, ex.: -12.29491' },
    },
  });
  const paraTexto = (valor: unknown) => {
    if (typeof valor !== 'number') return valor;
    const texto = String(valor);
    const casas = texto.includes('e') ? 0 : (texto.split('.')[1] ?? '').length;
    return casas < 5 ? valor.toFixed(5) : texto;
  };
  const validar = (valor: string) => {
    const texto = base.validate(valor, undefined);
    if (Math.abs(Number(texto)) > limite) throw new Error(`${label}: use um valor entre -${limite} e ${limite}.`);
    return texto;
  };
  return {
    ...base,
    parse: (valor: unknown) => base.parse(paraTexto(valor) as never, undefined),
    validate: validar,
    serialize: (valor: string) => ({ value: valor === '' ? undefined : Number(valor) }),
    reader: { parse: (valor: unknown) => Number(validar(base.reader.parse(paraTexto(valor) as never) as string)) },
  } as unknown as typeof base;
}

/**
 * Caixa "mostrar" ligada por padrão que só aparece no JSON quando DESMARCADA
 * ("mostrar": false). Assim o JSON atual (sem a chave) continua idêntico.
 */
function caixaMostrar(label: string, description: string) {
  const base = fields.checkbox({ label, description, defaultValue: true });
  return {
    ...base,
    parse: (valor: unknown) => (valor === undefined ? true : base.parse(valor as never)),
    serialize: (valor: boolean) => ({ value: valor ? undefined : false }),
    reader: { parse: (valor: unknown) => (valor === undefined ? true : base.reader.parse(valor as never)) },
  } as typeof base;
}

/** Tipos de foto que o site aceita (src/utils/imagens.ts). gif e heic (fotos do iPhone) não. */
const EXTENSOES_FOTO = ['webp', 'png', 'jpg', 'jpeg', 'avif'];
const avisoExtensao =
  'Tipo de arquivo não aceito. Use foto .webp, .jpg, .png ou .avif (gif e heic, do iPhone, não são aceitos: converta antes).';

const extensaoDe = (nome: string) => (nome.match(/\.([^.]+)$/)?.[1] ?? '').toLowerCase();

/**
 * Nome de um arquivo NOVO enviado pelo painel: nome original sem caracteres que
 * atrapalham em link ou no Windows (# % ? / \ : * " < > |), + sufixo curto com
 * data e hora (base 36), + extensão em minúscula.
 * Ex.: "Foto Teste.JPG" → "Foto Teste-mi0k3x2a.jpg".
 * O sufixo evita que uma foto nova substitua outra foto com o mesmo nome.
 */
function nomeDeFotoNova(original: string): string {
  const extensao = extensaoDe(original);
  const nome =
    original
      .replace(/\.[^.]+$/, '')
      .replace(/[#%?/\\:*"<>|\u0000-\u001f]+/g, '-')
      .replace(/\s+/g, ' ')
      .replace(/^[\s.-]+|[\s.-]+$/g, '')
      .slice(0, 60) || 'foto';
  return `${nome}-${Date.now().toString(36)}.${extensao}`;
}

/**
 * Imagem gravada em src/assets/images/ (o site otimiza com astro:assets), com
 * só o nome do arquivo no JSON.
 *
 * O campo de imagem do Keystatic, ao salvar uma tela, renomeia TODOS os
 * arquivos para o caminho do campo (ex.: "cartoes/cartao1/imagem.webp"), mesmo
 * sem troca de foto. Aqui:
 * - fotos que já existem continuam com o mesmo nome (sem renomear);
 * - foto nova entra com nome único (nomeDeFotoNova, aplicado só no envio), para
 *   não substituir outra foto que tenha o mesmo nome; a extensão vira minúscula.
 *   (A extensão de foto que JÁ existe não é trocada ao salvar: no Windows, trocar
 *   "X.JPG" por "X.jpg" faria o Keystatic apagar o próprio arquivo.)
 * - arquivo de tipo não aceito (gif, heic...) é recusado na hora, com aviso, e
 *   também reprovado na validação (não salva).
 * Ao trocar a foto, o Keystatic apaga o arquivo antigo da pasta.
 */
function campoImagem(label: string, description: string) {
  const base = fields.image({
    label,
    description,
    directory: 'src/assets/images',
    validation: { isRequired: true },
    transformFilename: nomeDeFotoNova,
  });
  type Valor = Parameters<typeof base.serialize>[0];
  const extensaoAceita = (valor: Valor) => valor === null || EXTENSOES_FOTO.includes(extensaoDe(valor.filename));
  return {
    ...base,
    Input: (props: Parameters<typeof base.Input>[0]) =>
      createElement(base.Input, {
        ...props,
        onChange: (valor: Valor) => {
          if (!extensaoAceita(valor)) {
            window.alert(avisoExtensao);
            return;
          }
          props.onChange(valor);
        },
      }),
    validate: (valor: Valor) => {
      if (!extensaoAceita(valor)) throw new Error(`${label}: ${avisoExtensao}`);
      return base.validate(valor);
    },
    serialize: (valor: Valor, args: Parameters<typeof base.serialize>[1]) =>
      base.serialize(valor, { ...args, suggestedFilenamePrefix: undefined }),
  } as typeof base;
}

// ---------------------------------------------------------------------------
// Blocos reutilizados
// ---------------------------------------------------------------------------

/** Botão que abre o WhatsApp (WhatsAppCTA em src/types/content.ts). */
function botaoWhatsapp(
  label: string,
  opts: { comTextoCurto?: boolean; maxTexto?: number; mostrar?: { label: string; description: string } } = {},
) {
  // Com texto curto: "Texto do botão" e "Texto curto" lado a lado no computador.
  const layout = [...(opts.mostrar ? [12] : []), ...(opts.comTextoCurto ? [7, 5] : [12]), 12];
  return fields.object(
    {
      ...(opts.mostrar ? { mostrar: caixaMostrar(opts.mostrar.label, opts.mostrar.description) } : {}),
      text: fields.text({
        label: 'Texto do botão',
        validation: { isRequired: true, length: { max: opts.maxTexto ?? 40 } },
      }),
      ...(opts.comTextoCurto
        ? {
            textCurto: fields.text({
              label: 'Texto curto no celular (opcional)',
              validation: { length: { max: 20 } },
            }),
          }
        : {}),
      whatsappAssunto: fields.text({
        label: 'Assunto da mensagem no WhatsApp',
        description: ajudaWhatsapp,
        validation: { isRequired: true, length: { max: 120 } },
      }),
    },
    { label, layout },
  );
}

/** Título de seção com trecho em destaque (e quebra de linha opcional). */
function titulo(max: number, opts: { quebra?: boolean; description?: string } = {}) {
  return fields.text({
    label: 'Título',
    multiline: opts.quebra,
    description: [opts.description, opts.quebra ? ajudaTituloComQuebra : undefined].filter(Boolean).join(' ') || undefined,
    validation: { isRequired: true, length: { max } },
  });
}

function tituloDestaque(max = 40) {
  return fields.text({ label: 'Trecho em destaque no título', description: ajudaDestaque, validation: { length: { max } } });
}

function textoObrigatorio(label: string, max: number, opts: { multiline?: boolean; description?: string } = {}) {
  return fields.text({
    label,
    multiline: opts.multiline,
    description: opts.description,
    validation: { isRequired: true, length: { max } },
  });
}

/** Lista de cartões com ícone, título e texto (cor pela posição, definida no site). */
function cartoesComIcone(label: string, description: string, max: number) {
  return fields.array(
    fields.object({
      icone: fields.select({ label: 'Ícone', options: opcoesIcone, defaultValue: 'star' }),
      titulo: textoObrigatorio('Título', 50),
      texto: textoObrigatorio('Texto', 200, { multiline: true }),
    }, { layout: [4, 8, 12] }),
    {
      label,
      description,
      itemLabel: (props) => props.fields.titulo.value || 'Cartão',
      validation: { length: { min: 1, max } },
    },
  );
}

/** Cartão de foto do Hero (posição fixa no layout). */
function cartaoFoto(label: string) {
  return fields.object(
    {
      rotulo: textoObrigatorio('Nome no cartão', 25, { description: 'Ex.: Balé Infantil' }),
      estrela: fields.checkbox({ label: 'Estrela dourada depois do nome', defaultValue: false }),
      frase: textoObrigatorio('Frase curta', 30, { description: 'Em maiúsculas, abaixo do nome. Ex.: FOCO & RESPEITO' }),
      imagem: campoImagem(
        'Foto',
        'Quadrada, cerca de 1024 × 1024 px. Aceita .webp, .jpg, .png ou .avif (gif e heic não).',
      ),
      textoAlternativo: textoObrigatorio('Descrição da foto', 80, {
        description: 'Para leitores de tela e o Google. Ex.: Aluna do Balé Prisma',
      }),
    },
    { label },
  );
}

// ---------------------------------------------------------------------------
// Configuração
// ---------------------------------------------------------------------------

export default config({
  storage: import.meta.env.DEV
    ? { kind: 'local' }
    : { kind: 'github', repo: 'wflipe/escola-prisma' },

  // Textos do próprio Keystatic (botões, busca, menus) em português, onde ele tem tradução.
  locale: 'pt-BR',

  ui: {
    brand: { name: 'Escola Prisma', mark: LogoDoPainel },
    navigation: {
      'Topo da página': ['hero', 'matriculas'],
      'Seções da página': [
        'secoes',
        'proposta',
        'manifesto',
        'valores',
        'rotina',
        'etapas',
        'diferenciais',
        'porQue',
        'depoimentos',
        'faq',
        'instagram',
        'chamadaFinal',
      ],
      'Site todo': ['menuRodape', 'pagina404', 'escola', 'seo'],
    },
  },

  singletons: {
    // ------------------------------------------------------------------ Hero
    hero: singleton({
      label: 'Topo (Hero)',
      path: 'src/content/site/hero',
      format: { data: 'json' },
      schema: {
        verNoSite: ondeAparece('Primeira parte da página: título, botão do WhatsApp e as 3 fotos.', '/#inicio'),
        badge: fields.text({
          label: 'Selo acima do título',
          description: 'Frase curta. Separe as palavras com " · ".',
          validation: { isRequired: true, length: { max: 60 } },
        }),
        headline: fields.text({
          label: 'Título principal',
          description: 'O título maior da página. Prefira frases curtas: texto longo quebra o layout no celular.',
          validation: { isRequired: true, length: { max: 90 } },
        }),
        headlineHighlight: fields.text({
          label: 'Palavra em destaque no título',
          description: 'Opcional. Trecho do título em itálico dourado: copie igualzinho ao que está no título.',
          validation: { length: { max: 30 } },
        }),
        subheadline: fields.text({
          label: 'Texto abaixo do título',
          multiline: true,
          validation: { isRequired: true, length: { max: 240 } },
        }),
        primaryCTA: botaoWhatsapp('Botão principal (WhatsApp)'),
        trustIndicators: fields.array(
          fields.object({
            text: fields.text({
              label: 'Texto',
              validation: { isRequired: true, length: { max: 30 } },
            }),
          }),
          {
            label: 'Indicadores de confiança',
            description: 'Até 3, numa linha abaixo do botão (mais que isso quebra a linha no celular). Sem nenhum, a linha some.',
            itemLabel: (props) => props.fields.text.value || 'Indicador',
            validation: { length: { max: 3 } },
          },
        ),
        cartoes: fields.object(
          {
            cartao1: cartaoFoto('Cartão 1 (no alto, à direita)'),
            cartao2: cartaoFoto('Cartão 2 (no meio, à esquerda)'),
            cartao3: cartaoFoto('Cartão 3 (embaixo, à direita)'),
          },
          {
            label: 'Cartões de foto',
            description: 'Os 3 cartões inclinados ao lado do título. Posição e cor são fixas; troque textos e fotos.',
            // Lado a lado no computador, como no site; um embaixo do outro no celular.
            layout: [4, 4, 4],
          },
        ),
      },
    }),

    // ------------------------------------------------------------ Matrículas
    matriculas: singleton({
      label: 'Matrículas',
      path: 'src/content/site/matriculas',
      format: { data: 'json' },
      schema: {
        verNoSite: ondeAparece('Banner logo abaixo do topo e faixa fina no alto do site.', '/#matriculas'),
        ativo: fields.checkbox({
          label: 'Mostrar o banner de matrículas',
          description: 'Desmarcado, esconde o banner e a faixa do topo (os textos ficam guardados).',
          defaultValue: true,
        }),
        selo: fields.text({
          label: 'Selo',
          validation: { isRequired: true, length: { max: 30 } },
        }),
        titulo: fields.text({
          label: 'Título',
          validation: { isRequired: true, length: { max: 50 } },
        }),
        tituloDestaque: fields.text({
          label: 'Trecho em destaque no título',
          description: 'Opcional. Copie igualzinho ao que está no título (ex.: o ano).',
          validation: { length: { max: 20 } },
        }),
        texto: fields.text({
          label: 'Texto',
          multiline: true,
          validation: { isRequired: true, length: { max: 220 } },
        }),
        etapas: fields.array(
          fields.text({ label: 'Etapa', validation: { isRequired: true, length: { max: 30 } } }),
          {
            label: 'Etapas com vagas',
            description: 'De 1 a 6, em caixinhas com ✓ ao lado do texto.',
            itemLabel: (props) => props.value || 'Etapa',
            validation: { length: { min: 1, max: 6 } },
          },
        ),
        cta: botaoWhatsapp('Botão principal (WhatsApp)', { comTextoCurto: true }),
        ctaSecundario: botaoWhatsapp('Botão secundário (WhatsApp)', {
          mostrar: {
            label: 'Mostrar o botão secundário',
            description: 'Desmarcado, esconde o botão (o texto fica guardado).',
          },
        }),
        observacao: fields.text({
          label: 'Observação abaixo dos botões (opcional)',
          validation: { length: { max: 80 } },
        }),
        faixaTopo: fields.object(
          {
            ativo: fields.checkbox({
              label: 'Mostrar a faixa no topo',
              defaultValue: true,
            }),
            texto: fields.text({
              label: 'Texto da faixa',
              validation: { isRequired: true, length: { max: 40 } },
            }),
            chamada: fields.text({
              label: 'Chamada (computador)',
              validation: { isRequired: true, length: { max: 40 } },
            }),
            chamadaCurta: fields.text({
              label: 'Chamada curta (celular)',
              validation: { isRequired: true, length: { max: 20 } },
            }),
            link: fields.text({
              label: 'Link da faixa',
              description: 'Para onde a faixa leva. Padrão: /#matriculas. Começa com /, # ou https://',
              validation: {
                isRequired: true,
                length: { max: 200 },
                pattern: { regex: /^(\/|#|https:\/\/)\S*$/, message: 'Use um link que comece com /, # ou https:// (ex.: /#matriculas), sem espaços.' },
              },
            }),
          },
          {
            label: 'Faixa fina no topo do site',
            description: 'Só aparece se o banner de matrículas também estiver ligado.',
            layout: [12, 12, 6, 6, 12],
          },
        ),
      },
    }),

    // ---------------------------------------------- Seções: ordem e visibilidade
    secoes: singleton({
      label: 'Seções: ordem e visibilidade',
      path: 'src/content/site/secoes',
      format: { data: 'json' },
      schema: {
        verNoSite: ondeAparece('Ordem e visibilidade das seções da página inicial.'),
        items: fields.array(
          fields.object({
            secao: fields.select({
              label: 'Seção',
              options: opcoesSecao,
              defaultValue: 'ProblemSolution',
            }),
            ativo: fields.checkbox({ label: 'Mostrar esta seção', defaultValue: true }),
          }),
          {
            label: 'Seções (na ordem da página)',
            description:
              'Arraste para mudar a ordem; desmarque "Mostrar esta seção" para esconder (some também do menu). ' +
              'O topo e o banner de matrículas ficam sempre no início.',
            itemLabel: (props) =>
              `${nomeDaSecao[props.fields.secao.value as SecaoId] ?? props.fields.secao.value}${props.fields.ativo.value ? '' : ' (escondida)'}`,
            validation: { length: { max: ordemDasSecoes.length } },
          },
        ),
        mostrarDepoimentos: fields.checkbox({
          label: 'Mostrar depoimentos',
          description: 'Liga o bloco "O que dizem as famílias", na seção Famílias. Só com depoimentos reais e autorizados.',
          defaultValue: false,
        }),
      },
    }),

    // ------------------------------------------------- A Escola (ProblemSolution)
    proposta: singleton({
      label: 'A Escola (proposta)',
      path: 'src/content/site/secao-proposta',
      format: { data: 'json' },
      schema: {
        verNoSite: ondeAparece('Seção "A Escola", logo depois do banner de matrículas.', naPagina('ProblemSolution')),
        selo: textoObrigatorio('Frase acima do título', 50),
        titulo: titulo(160, { quebra: true }),
        tituloDestaque: tituloDestaque(),
        texto: textoObrigatorio('Texto abaixo do título', 300, { multiline: true }),
        cartoes: cartoesComIcone(
          'Cartões',
          'Arraste para mudar a ordem. A cor (laranja, azul, verde) segue a posição. No computador ficam 3 por linha: use 3 ou 6.',
          6,
        ),
      },
    }),

    // ------------------------------------------------------------- Manifesto
    manifesto: singleton({
      label: 'Manifesto',
      path: 'src/content/site/secao-manifesto',
      format: { data: 'json' },
      schema: {
        verNoSite: ondeAparece('Faixa de texto com fundo colorido, depois de "A Escola".', naPagina('Manifesto')),
        selo: textoObrigatorio('Frase acima do título', 60),
        titulo: titulo(90, { quebra: true }),
        tituloDestaque: tituloDestaque(),
        texto: textoObrigatorio('Texto', 400, { multiline: true }),
        botao: botaoWhatsapp('Botão (WhatsApp)'),
      },
    }),

    // ------------------------------------------------------ Valores cristãos
    valores: singleton({
      label: 'Valores cristãos',
      path: 'src/content/site/secao-valores',
      format: { data: 'json' },
      schema: {
        verNoSite: ondeAparece('Seção "Valores cristãos", com cartões.', naPagina('ChristianValues')),
        selo: textoObrigatorio('Selo acima do título', 30),
        titulo: titulo(80, { quebra: true }),
        tituloDestaque: tituloDestaque(),
        texto: textoObrigatorio('Texto abaixo do título', 300, { multiline: true }),
        cartoes: cartoesComIcone(
          'Cartões',
          'Arraste para mudar a ordem. A cor (laranja, azul, amarelo) segue a posição. No computador ficam 3 por linha: use 3 ou 6.',
          6,
        ),
      },
    }),

    // --------------------------------------------------------- Rotina e vídeo
    rotina: singleton({
      label: 'Rotina e vídeo',
      path: 'src/content/site/secao-rotina',
      format: { data: 'json' },
      schema: {
        verNoSite: ondeAparece('Seção da rotina, com a lista ao lado do vídeo.', naPagina('DailyRoutine')),
        titulo: textoObrigatorio('Título', 90),
        texto: textoObrigatorio('Texto abaixo do título', 250, { multiline: true }),
        itens: cartoesComIcone('Itens da rotina', 'Arraste para mudar a ordem. De 1 a 5; o ideal são 3 (ficam ao lado do vídeo).', 5),
        video: fields.object(
          {
            youtubeId: fields.text({
              label: 'Vídeo (ID do YouTube)',
              description: 'O que vem depois de "watch?v=" no link. Ex.: qYuossXmZfc',
              validation: { isRequired: true, pattern: { regex: /^[A-Za-z0-9_-]{11}$/, message: 'O ID do YouTube tem 11 caracteres (letras, números, - e _).' } },
            }),
            titulo: textoObrigatorio('Título do vídeo', 80, { description: 'Lido por leitores de tela no botão de play.' }),
            textoAlternativo: textoObrigatorio('Descrição da capa', 100, { description: 'Para leitores de tela e o Google.' }),
          },
          { label: 'Vídeo' },
        ),
      },
    }),

    // ----------------------------------------------------- Fases (phases)
    etapas: singleton({
      label: 'Fases de ensino',
      path: 'src/content/site/phases',
      format: { data: 'json' },
      schema: {
        verNoSite: ondeAparece('Seção "Fases de ensino", com um cartão por etapa.', naPagina('Phases')),
        selo: textoObrigatorio('Frase acima do título', 40),
        titulo: titulo(120, { quebra: true }),
        tituloDestaque: tituloDestaque(),
        texto: textoObrigatorio('Texto abaixo do título', 250, { multiline: true }),
        assinatura: textoObrigatorio('Frase abaixo dos cartões', 60, { description: 'Em itálico. Ex.: Avançar de fase é evoluir.' }),
        items: fields.array(
          fields.object({
            title: fields.text({
              label: 'Nome da etapa',
              validation: { isRequired: true, length: { max: 30 } },
            }),
            slug: fields.text({
              label: 'Identificador',
              description: 'Uso interno: minúsculas, números e hífen. Ex.: fundamental-1',
              validation: { isRequired: true, length: { max: 40 }, pattern: { regex: /^[a-z0-9-]+$/, message: 'Use só letras minúsculas, números e hífen.' } },
            }),
            phaseLabel: fields.text({
              label: 'Rótulo da fase',
              validation: { isRequired: true, length: { max: 30 } },
            }),
            icon: fields.select({ label: 'Ícone', options: opcoesIcone, defaultValue: 'heart' }),
            color: fields.select({
              label: 'Cor do cartão',
              options: [
                { label: 'Amarela', value: 'amarela' },
                { label: 'Laranja', value: 'laranja' },
                { label: 'Azul', value: 'azul' },
                { label: 'Carvão (escuro)', value: 'carvao' },
              ],
              defaultValue: 'amarela',
            }),
            description: fields.text({
              label: 'Descrição',
              multiline: true,
              validation: { isRequired: true, length: { max: 220 } },
            }),
            ctaText: fields.text({
              label: 'Texto do botão',
              validation: { isRequired: true, length: { max: 25 } },
            }),
            whatsappAssunto: fields.text({
              label: 'Assunto da mensagem no WhatsApp',
              description: ajudaWhatsapp,
              validation: { isRequired: true, length: { max: 120 } },
            }),
          }, { layout: [12, 12, 4, 4, 4, 12, 12, 12] }),
          {
            label: 'Etapas',
            description: 'Arraste para mudar a ordem. "Rótulo da fase" é o texto pequeno do cartão (ex.: 1ª Descobrir).',
            itemLabel: (props) => props.fields.title.value || 'Etapa',
            validation: { length: { min: 1, max: 6 } },
          },
        ),
      },
    }),

    // ------------------------------------------------- Diferenciais (ecosystem)
    diferenciais: singleton({
      label: 'Diferenciais',
      path: 'src/content/site/ecosystem',
      format: { data: 'json' },
      schema: {
        verNoSite: ondeAparece('Seção "Diferenciais", de fundo azul-marinho.', naPagina('Ecosystem')),
        titulo: titulo(80, { quebra: true }),
        tituloDestaque: tituloDestaque(),
        texto: textoObrigatorio('Texto abaixo do título', 250, { multiline: true }),
        textoBotao: textoObrigatorio('Texto do botão', 40),
        whatsappAssunto: fields.text({
          label: 'Assunto da mensagem no WhatsApp (botão da seção)',
          description: ajudaWhatsapp,
          validation: { isRequired: true, length: { max: 120 } },
        }),
        items: fields.array(
          fields.object({
            icon: fields.select({ label: 'Ícone', options: opcoesIcone, defaultValue: 'star' }),
            title: fields.text({
              label: 'Título',
              validation: { isRequired: true, length: { max: 50 } },
            }),
            description: fields.text({
              label: 'Descrição',
              multiline: true,
              validation: { isRequired: true, length: { max: 180 } },
            }),
          }, { layout: [4, 8, 12] }),
          {
            label: 'Diferenciais',
            description: 'Arraste para mudar a ordem.',
            itemLabel: (props) => props.fields.title.value || 'Diferencial',
            validation: { length: { min: 1, max: 8 } },
          },
        ),
      },
    }),

    // ------------------------------------------- Por que a Prisma (why-items)
    porQue: singleton({
      label: 'Famílias: por que a Prisma',
      path: 'src/content/site/why-items',
      format: { data: 'json' },
      schema: {
        verNoSite: ondeAparece('Seção "Famílias": título e os motivos para escolher a Prisma.', naPagina('SocialProof')),
        titulo: textoObrigatorio('Título', 60),
        texto: textoObrigatorio('Texto abaixo do título', 200, { multiline: true }),
        items: fields.array(
          fields.object({
            icon: fields.select({ label: 'Ícone', options: opcoesIcone, defaultValue: 'star' }),
            title: fields.text({
              label: 'Título',
              validation: { isRequired: true, length: { max: 50 } },
            }),
            description: fields.text({
              label: 'Descrição',
              multiline: true,
              validation: { isRequired: true, length: { max: 160 } },
            }),
          }, { layout: [4, 8, 12] }),
          {
            label: 'Motivos ("Por que escolher a Prisma")',
            description: 'Arraste para mudar a ordem.',
            itemLabel: (props) => props.fields.title.value || 'Motivo',
            validation: { length: { min: 1, max: 6 } },
          },
        ),
      },
    }),

    // ------------------------------------------------------------ Depoimentos
    depoimentos: singleton({
      label: 'Famílias: depoimentos',
      path: 'src/content/testimonials/testimonials',
      format: { data: 'json' },
      schema: {
        verNoSite: ondeAparece('Bloco "O que dizem as famílias", na seção Famílias (só se ligado em "Seções").', naPagina('SocialProof')),
        titulo: textoObrigatorio('Título do bloco', 60),
        texto: textoObrigatorio('Texto abaixo do título', 200, { multiline: true }),
        items: fields.array(
          fields.object({
            // Identificador antigo, não usado pelo site: fica fora da tela, mas o valor
            // que já existe no JSON é mantido ao salvar (depoimento novo sai sem "id").
            id: fields.ignored(),
            initial: fields.text({
              label: 'Inicial',
              validation: { isRequired: true, length: { max: 2 } },
            }),
            name: fields.text({
              label: 'Nome',
              validation: { isRequired: true, length: { max: 40 } },
            }),
            role: fields.text({
              label: 'Quem é (ex.: "Mãe de aluna do 4º ano")',
              validation: { isRequired: true, length: { max: 50 } },
            }),
            text: fields.text({
              label: 'Depoimento',
              multiline: true,
              validation: { isRequired: true, length: { max: 320 } },
            }),
          }, { layout: [12, 4, 8, 12, 12] }),
          {
            label: 'Depoimentos',
            description:
              'De 1 a 6 (2 por linha no computador: use número par). "Inicial" é a letra no círculo. Só depoimentos reais e autorizados.',
            itemLabel: (props) => props.fields.name.value || 'Depoimento',
            validation: { length: { min: 1, max: 6 } },
          },
        ),
      },
    }),

    // --------------------------------------------------- Perguntas frequentes
    faq: singleton({
      label: 'Dúvidas (perguntas frequentes)',
      path: 'src/content/faqs/faqs',
      format: { data: 'json' },
      schema: {
        verNoSite: ondeAparece('Seção "Dúvidas", com as perguntas que abrem e fecham.', naPagina('FAQ')),
        titulo: textoObrigatorio('Título da seção', 90),
        items: fields.array(
          fields.object({
            question: fields.text({
              label: 'Pergunta',
              validation: { isRequired: true, length: { max: 120 } },
            }),
            answer: fields.text({
              label: 'Resposta',
              multiline: true,
              description: 'Escreva frases completas (a resposta também vai para o Google).',
              validation: { isRequired: true, length: { max: 450 } },
            }),
          }),
          {
            label: 'Perguntas e respostas',
            description: 'Arraste para mudar a ordem. Mínimo de uma; para tirar a seção do site, esconda-a em "Seções".',
            itemLabel: (props) => props.fields.question.value || 'Pergunta',
            validation: { length: { min: 1 } },
          },
        ),
      },
    }),

    // -------------------------------------------------------------- Instagram
    instagram: singleton({
      label: 'Instagram',
      path: 'src/content/site/secao-instagram',
      format: { data: 'json' },
      schema: {
        verNoSite: ondeAparece('Seção do Instagram, acima das fotos do perfil.', naPagina('SocialFeed')),
        titulo: titulo(60, { description: 'O @ e o link do perfil vêm de "Dados da escola".' }),
        tituloDestaque: tituloDestaque(),
        texto: textoObrigatorio('Texto abaixo do título', 200, { multiline: true }),
      },
    }),

    // ---------------------------------------------------------- Chamada final
    chamadaFinal: singleton({
      label: 'Chamada final (visita)',
      path: 'src/content/site/secao-chamada-final',
      format: { data: 'json' },
      schema: {
        verNoSite: ondeAparece('Último bloco da página, antes do rodapé (convite para a visita).', naPagina('FinalCTA')),
        titulo: titulo(80, { quebra: true }),
        tituloDestaque: tituloDestaque(),
        texto: textoObrigatorio('Texto abaixo do título', 250, { multiline: true }),
        botao: botaoWhatsapp('Botão (WhatsApp)'),
        apoio: textoObrigatorio('Texto abaixo do botão', 200, { multiline: true }),
        microTexto: textoObrigatorio('Linha pequena no final', 100),
      },
    }),

    // --------------------------------------------------------- Menu e rodapé
    menuRodape: singleton({
      label: 'Menu e rodapé',
      path: 'src/content/site/menu-rodape',
      format: { data: 'json' },
      schema: {
        verNoSite: ondeAparece('Menu do topo (e do celular), botões fixos e rodapé, em todas as páginas.'),
        menu: fields.array(
          fields.object({
            texto: textoObrigatorio('Texto no menu', 20),
            secao: fields.select({
              label: 'Leva para a seção',
              options: opcoesSecaoDoMenu,
              defaultValue: 'ProblemSolution',
            }),
          }, { layout: [6, 6] }),
          {
            label: 'Itens do menu (topo e celular)',
            description: 'Arraste para mudar a ordem. Até 6 (o menu fica numa linha só). Seção escondida some do menu sozinha.',
            itemLabel: (props) =>
              `${props.fields.texto.value || 'Item'} → ${nomeDaSecao[props.fields.secao.value as SecaoId] ?? props.fields.secao.value}`,
            validation: { length: { max: 6 } },
          },
        ),
        botaoContato: botaoWhatsapp('Botão "Fale Conosco" (topo e menu do celular)', { maxTexto: 20 }),
        portalPais: fields.object(
          {
            texto: textoObrigatorio('Texto', 25),
            link: fields.url({ label: 'Link', validation: { isRequired: true } }),
          },
          { label: 'Link do portal dos pais (barra azul e menu do celular)', layout: [5, 7] },
        ),
        portalAluno: fields.object(
          {
            texto: textoObrigatorio('Texto', 25),
            link: fields.url({ label: 'Link', validation: { isRequired: true } }),
          },
          { label: 'Link do portal do aluno (barra azul e menu do celular)', layout: [5, 7] },
        ),
        botaoFlutuante: fields.object(
          {
            rotulo: textoObrigatorio('Nome do botão', 60, { description: 'O botão só tem o ícone; este nome é lido por leitores de tela.' }),
            whatsappAssunto: textoObrigatorio('Assunto da mensagem no WhatsApp', 120, { description: ajudaWhatsapp }),
          },
          { label: 'Botão redondo do WhatsApp (canto da tela)' },
        ),
        rodape: fields.object(
          {
            tituloContato: textoObrigatorio('Título da coluna de contato', 30),
            sufixoFixo: textoObrigatorio('Texto depois do telefone fixo', 20, { description: 'Ex.: (Fixo)' }),
            sufixoWhatsapp: textoObrigatorio('Texto depois do WhatsApp', 20, { description: 'Ex.: (WhatsApp)' }),
            whatsappAssunto: textoObrigatorio('Assunto da mensagem no WhatsApp (link do rodapé)', 120, { description: ajudaWhatsapp }),
            tituloMapa: textoObrigatorio('Título da coluna do mapa', 30),
            mapaRotulo: textoObrigatorio('Nome do mapa', 80, { description: 'Lido por leitores de tela.' }),
            mapaEmbed: fields.text({
              label: 'Link do mapa incorporado',
              description: 'Google Maps → Compartilhar → Incorporar um mapa → copie só o que está dentro de src="...".',
              validation: {
                isRequired: true,
                length: { max: 1000 },
                pattern: { regex: /^https:\/\/www\.google\.com\/maps\/embed\?pb=\S+$/, message: 'Use o link de "Incorporar um mapa" do Google Maps (https://www.google.com/maps/embed?pb=...).' },
              },
            }),
            direitos: textoObrigatorio('Linha de direitos (depois do ©)', 100, { description: 'Ex.: 2026 Escola Prisma. Todos os direitos reservados.' }),
          },
          {
            label: 'Rodapé',
            description: 'Endereço, telefones e slogan vêm de "Dados da escola".',
            layout: [12, 6, 6, 12, 12, 12, 12, 12],
          },
        ),
      },
    }),

    // ---------------------------------------------------- Página 404
    pagina404: singleton({
      label: 'Página não encontrada (404)',
      path: 'src/content/site/pagina-404',
      format: { data: 'json' },
      schema: {
        verNoSite: ondeAparece('Página mostrada quando alguém abre um endereço que não existe.', '/esta-pagina-nao-existe'),
        tituloAba: textoObrigatorio('Título da aba do navegador', 70),
        descricao: textoObrigatorio('Descrição (Google)', 170, { multiline: true }),
        titulo: textoObrigatorio('Título', 60),
        texto: textoObrigatorio('Texto', 250, { multiline: true }),
        botaoInicio: textoObrigatorio('Botão que volta para o início', 30),
        botaoWhatsapp: botaoWhatsapp('Botão do WhatsApp', { maxTexto: 30 }),
      },
    }),

    // ------------------------------------------------------- Dados da escola
    escola: singleton({
      label: 'Dados da escola',
      path: 'src/content/site/escola',
      format: { data: 'json' },
      schema: {
        verNoSite: ondeAparece('Rodapé, menu, seção Instagram e informações para o Google.'),
        nome: fields.text({ label: 'Nome da escola', validation: { isRequired: true, length: { max: 60 } } }),
        // Domínio oficial: fora do painel (precisa ser igual ao "site" do astro.config.mjs; o build confere).
        site: fields.ignored(),
        slogan: fields.text({
          label: 'Slogan',
          description: 'Aparece no rodapé, abaixo do logotipo, e no Google.',
          validation: { isRequired: true, length: { max: 80 } },
        }),
        anoFundacao: fields.text({
          label: 'Ano de fundação',
          description: 'Opcional. Só o ano confirmado (ex.: 1997). Vazio = não vai para o Google.',
          validation: { length: { max: 4 }, pattern: { regex: /^(\d{4})?$/, message: 'Use 4 dígitos (ex.: 1997) ou deixe vazio.' } },
        }),
        endereco: fields.object(
          {
            logradouro: fields.text({ label: 'Rua / logradouro', validation: { isRequired: true, length: { max: 100 } } }),
            cidade: fields.text({ label: 'Cidade', validation: { isRequired: true, length: { max: 60 } } }),
            uf: fields.text({ label: 'UF', validation: { isRequired: true, length: { min: 2, max: 2 } } }),
            cep: fields.text({
              label: 'CEP',
              validation: { isRequired: true, pattern: { regex: /^\d{5}-\d{3}$/, message: 'Use o formato 00000-000.' } },
            }),
            pais: fields.text({
              label: 'País',
              validation: { isRequired: true, length: { min: 2, max: 2 } },
            }),
          },
          {
            label: 'Endereço',
            description: 'Igual ao Perfil da Empresa no Google. País: BR.',
            layout: [12, 5, 2, 3, 2],
          },
        ),
        geo: fields.object(
          {
            latitude: campoCoordenada('Latitude', 90),
            longitude: campoCoordenada('Longitude', 180),
          },
          { label: 'Coordenadas no mapa', description: 'Mesmo ponto do Perfil da Empresa no Google.', layout: [6, 6] },
        ),
        mapaUrl: fields.url({ label: 'Link do mapa (Google Maps)', validation: { isRequired: true } }),
        telefoneFixo: fields.object(
          {
            exibicao: fields.text({ label: 'Como aparece no site', description: 'Ex.: (75) 3622-9180', validation: { isRequired: true, length: { max: 20 } } }),
            e164: fields.text({
              label: 'Formato internacional',
              description: 'Com +55, sem espaços. Ex.: +557536229180',
              validation: { isRequired: true, pattern: { regex: /^\+\d{10,15}$/, message: 'Use + seguido só de números.' } },
            }),
          },
          { label: 'Telefone fixo', layout: [6, 6] },
        ),
        whatsapp: fields.object(
          {
            exibicao: fields.text({ label: 'Como aparece no site', description: 'Ex.: (75) 99895-4848', validation: { isRequired: true, length: { max: 20 } } }),
            numero: fields.text({
              label: 'Número para o link',
              description: 'Só números. Ex.: 5575998954848',
              validation: { isRequired: true, pattern: { regex: /^\d{10,15}$/, message: 'Use só números.' } },
            }),
            e164: fields.text({
              label: 'Formato internacional',
              description: 'Ex.: +5575998954848',
              validation: { isRequired: true, pattern: { regex: /^\+\d{10,15}$/, message: 'Use + seguido só de números.' } },
            }),
          },
          { label: 'WhatsApp', description: 'Sempre com 55 e o DDD.', layout: [4, 4, 4] },
        ),
        email: fields.text({
          label: 'E-mail',
          validation: { isRequired: true, length: { max: 100 }, pattern: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido.' } },
        }),
        instagram: fields.object(
          {
            usuario: fields.text({ label: 'Usuário', description: 'Com @. Ex.: @escolaprisma_', validation: { isRequired: true, length: { max: 40 } } }),
            url: fields.url({ label: 'Link do perfil', description: 'Ex.: https://www.instagram.com/escolaprisma_/', validation: { isRequired: true } }),
          },
          { label: 'Instagram', layout: [5, 7] },
        ),
        facebook: fields.url({ label: 'Link da página no Facebook', validation: { isRequired: true } }),
      },
    }),

    // ------------------------------------------------- SEO e compartilhamento
    seo: singleton({
      label: 'SEO e compartilhamento',
      path: 'src/content/site/seo',
      format: { data: 'json' },
      schema: {
        verNoSite: ondeAparece('Não aparece na página: é o que o Google, o WhatsApp e as redes mostram do site.'),
        titulo: fields.text({
          label: 'Título da página (Google e abas do navegador)',
          description: 'Ideal: até 60 caracteres.',
          validation: { isRequired: true, length: { max: 70 } },
        }),
        descricao: fields.text({
          label: 'Descrição (Google, WhatsApp, redes sociais)',
          description: 'Ideal: entre 120 e 160 caracteres.',
          multiline: true,
          validation: { isRequired: true, length: { max: 170 } },
        }),
        ogImage: fields.text({
          label: 'Imagem de compartilhamento',
          description:
            'Caminho de uma imagem 1200 × 630 que já está no site. Ex.: /assets/escola-prisma-marca-1200x630.png. Trocar o arquivo é com o desenvolvedor.',
          validation: { isRequired: true, length: { max: 200 }, pattern: { regex: /^\/[^\s]+\.(png|jpe?g|webp)$/, message: 'Use um caminho como /assets/nome-da-imagem.png' } },
        }),
        ogImageAlt: textoObrigatorio('Descrição da imagem de compartilhamento', 120, { description: 'Lida por leitores de tela quando o link é compartilhado.' }),
        descricaoEscola: textoObrigatorio('Descrição da escola para o Google e IAs', 400, {
          multiline: true,
          description: 'Não aparece na página. Só fatos confirmados.',
        }),
        temas: fields.array(textoObrigatorio('Tema', 60), {
          label: 'Temas que a escola domina (Google e IAs)',
          description: 'De 1 a 20. Não aparecem na página.',
          itemLabel: (props) => props.value || 'Tema',
          validation: { length: { min: 1, max: 20 } },
        }),
      },
    }),
  },
});
