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
  'Completa a frase "Olá! Vim pelo site da Escola Prisma e gostaria de ___." Comece com letra minúscula e não use ponto final.';

const ajudaDestaque =
  'Opcional. Trecho do título que aparece em itálico colorido. Precisa ser escrito exatamente igual ao que está no título.';

const ajudaTituloComQuebra =
  'Aperte Enter para quebrar a linha no computador (no celular o texto se ajusta sozinho).';

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
    description: `Número com ponto e de 5 a 7 casas decimais (ex.: -12.29491). Entre -${limite} e ${limite}.`,
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
              label: 'Texto curto (celular)',
              description: 'Opcional. Versão menor do texto, usada em telas estreitas.',
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
    { label },
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
    }),
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
      rotulo: textoObrigatorio('Nome no cartão', 25, { description: 'Ex.: Balé Infantil.' }),
      estrela: fields.checkbox({ label: 'Estrela dourada depois do nome', defaultValue: false }),
      frase: textoObrigatorio('Frase curta', 30, { description: 'Aparece em letras maiúsculas abaixo do nome. Ex.: FOCO & RESPEITO.' }),
      imagem: campoImagem(
        'Foto',
        'Use foto .webp quadrada, com cerca de 1024 x 1024 px (até ~200 KB); .jpg, .png e .avif também servem ' +
          '(gif e heic não). O site recorta e reduz sozinho. A foto nova fica em src/assets/images/ com o nome ' +
          'do arquivo mais um código no final (ex.: "Balé-mi0k3x2a.webp"), para nunca substituir outra foto.',
      ),
      textoAlternativo: textoObrigatorio('Descrição da foto', 80, {
        description: 'Para quem usa leitor de tela e para o Google. Ex.: Aluna do Balé Prisma.',
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

  ui: {
    brand: { name: 'Escola Prisma' },
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
        badge: fields.text({
          label: 'Selo acima do título',
          description: 'Frase curta. Use " · " para separar palavras.',
          validation: { isRequired: true, length: { max: 60 } },
        }),
        headline: fields.text({
          label: 'Título principal',
          description: 'O título maior da página (único <h1>). Textos longos quebram o layout no celular.',
          validation: { isRequired: true, length: { max: 90 } },
        }),
        headlineHighlight: fields.text({
          label: 'Palavra em destaque no título',
          description:
            'Opcional. Trecho do título que aparece em itálico dourado. Precisa ser escrito exatamente igual ao que está no título.',
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
            description:
              'Aparecem numa linha abaixo do botão, depois de uma estrela, separados por " · ". Até 3 (mais que isso quebra a linha no celular). Sem nenhum, a linha não aparece.',
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
            description: 'Os 3 cartões inclinados ao lado do título. As posições e cores são fixas; troque textos e fotos.',
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
        ativo: fields.checkbox({
          label: 'Mostrar o banner de matrículas',
          description: 'Desmarcado, esconde o banner e também a faixa do topo, sem apagar os textos.',
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
          description: 'Opcional. Precisa ser escrito exatamente igual ao que está no título (ex.: o ano).',
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
            description: 'De 1 a 6. Aparecem em caixinhas com ✓ ao lado do texto do banner.',
            itemLabel: (props) => props.value || 'Etapa',
            validation: { length: { min: 1, max: 6 } },
          },
        ),
        cta: botaoWhatsapp('Botão principal (WhatsApp)', { comTextoCurto: true }),
        ctaSecundario: botaoWhatsapp('Botão secundário (WhatsApp)', {
          mostrar: {
            label: 'Mostrar o botão secundário',
            description: 'Desmarcado, esconde o botão sem apagar o texto.',
          },
        }),
        observacao: fields.text({
          label: 'Observação abaixo dos botões',
          description: 'Opcional.',
          validation: { length: { max: 80 } },
        }),
        faixaTopo: fields.object(
          {
            ativo: fields.checkbox({
              label: 'Mostrar a faixa no topo',
              description: 'Só aparece se o banner de matrículas também estiver ligado.',
              defaultValue: true,
            }),
            texto: fields.text({
              label: 'Texto da faixa',
              validation: { isRequired: true, length: { max: 40 } },
            }),
            chamada: fields.text({
              label: 'Chamada (computador e tablet)',
              validation: { isRequired: true, length: { max: 40 } },
            }),
            chamadaCurta: fields.text({
              label: 'Chamada curta (celular)',
              validation: { isRequired: true, length: { max: 20 } },
            }),
            link: fields.text({
              label: 'Link da faixa',
              description:
                'Para onde a faixa leva. Padrão: /#matriculas (o banner nesta página). Precisa começar com /, # ou https://.',
              validation: {
                isRequired: true,
                length: { max: 200 },
                pattern: { regex: /^(\/|#|https:\/\/)\S*$/, message: 'Use um link que comece com /, # ou https:// (ex.: /#matriculas), sem espaços.' },
              },
            }),
          },
          { label: 'Faixa fina no topo do site' },
        ),
      },
    }),

    // ---------------------------------------------- Seções: ordem e visibilidade
    secoes: singleton({
      label: 'Seções: ordem e visibilidade',
      path: 'src/content/site/secoes',
      format: { data: 'json' },
      schema: {
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
              'Arraste para mudar a ordem e desmarque "Mostrar esta seção" para esconder. O topo (Hero) e o banner de matrículas ficam sempre no início. ' +
              'Seção escondida também some do menu (A Escola, Fases, Diferenciais, Famílias, Dúvidas). ' +
              'Se uma seção aparecer duas vezes na lista, vale só a primeira; seção apagada da lista fica escondida (use "Add" para trazê-la de volta).',
            itemLabel: (props) =>
              `${nomeDaSecao[props.fields.secao.value as SecaoId] ?? props.fields.secao.value}${props.fields.ativo.value ? '' : ' (escondida)'}`,
            validation: { length: { max: ordemDasSecoes.length } },
          },
        ),
        mostrarDepoimentos: fields.checkbox({
          label: 'Mostrar depoimentos',
          description:
            'Liga o bloco "O que dizem as famílias" dentro da seção Famílias (menu "Famílias"). Só marque com depoimentos reais e autorizados.',
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
        selo: textoObrigatorio('Frase acima do título', 50),
        titulo: titulo(160, { quebra: true }),
        tituloDestaque: tituloDestaque(),
        texto: textoObrigatorio('Texto abaixo do título', 300, { multiline: true }),
        cartoes: cartoesComIcone(
          'Cartões',
          'Arraste para mudar a ordem. As cores (laranja, azul, verde) seguem a posição e se repetem a partir do 4º cartão. No computador ficam 3 por linha: use 3 ou 6.',
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
        selo: textoObrigatorio('Selo acima do título', 30),
        titulo: titulo(80, { quebra: true }),
        tituloDestaque: tituloDestaque(),
        texto: textoObrigatorio('Texto abaixo do título', 300, { multiline: true }),
        cartoes: cartoesComIcone(
          'Cartões',
          'Arraste para mudar a ordem. As cores (laranja, azul, amarelo) seguem a posição e se repetem a partir do 4º cartão. No computador ficam 3 por linha: use 3 ou 6.',
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
        titulo: textoObrigatorio('Título', 90),
        texto: textoObrigatorio('Texto abaixo do título', 250, { multiline: true }),
        itens: cartoesComIcone('Itens da rotina', 'Arraste para mudar a ordem. De 1 a 5; o ideal são 3 (a lista fica ao lado do vídeo).', 5),
        video: fields.object(
          {
            youtubeId: fields.text({
              label: 'Vídeo (ID do YouTube)',
              description: 'A parte do link depois de "watch?v=". Ex.: em youtube.com/watch?v=qYuossXmZfc, o ID é qYuossXmZfc.',
              validation: { isRequired: true, pattern: { regex: /^[A-Za-z0-9_-]{11}$/, message: 'O ID do YouTube tem 11 caracteres (letras, números, - e _).' } },
            }),
            titulo: textoObrigatorio('Título do vídeo', 80, { description: 'Lido por leitores de tela no botão de play.' }),
            textoAlternativo: textoObrigatorio('Descrição da capa', 100, { description: 'Para quem usa leitor de tela e para o Google.' }),
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
        selo: textoObrigatorio('Frase acima do título', 40),
        titulo: titulo(120, { quebra: true }),
        tituloDestaque: tituloDestaque(),
        texto: textoObrigatorio('Texto abaixo do título', 250, { multiline: true }),
        assinatura: textoObrigatorio('Frase abaixo dos cartões', 60, { description: 'Aparece em itálico. Ex.: Avançar de fase é evoluir.' }),
        items: fields.array(
          fields.object({
            title: fields.text({
              label: 'Nome da etapa',
              validation: { isRequired: true, length: { max: 30 } },
            }),
            slug: fields.text({
              label: 'Identificador',
              description: 'Uso interno. Só letras minúsculas, números e hífen (ex.: fundamental-1).',
              validation: { isRequired: true, length: { max: 40 }, pattern: { regex: /^[a-z0-9-]+$/, message: 'Use só letras minúsculas, números e hífen.' } },
            }),
            phaseLabel: fields.text({
              label: 'Rótulo (ex.: "1ª Descobrir")',
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
          }),
          {
            label: 'Etapas',
            description: 'Arraste para mudar a ordem.',
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
          }),
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
          }),
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
        titulo: textoObrigatorio('Título do bloco', 60),
        texto: textoObrigatorio('Texto abaixo do título', 200, { multiline: true }),
        items: fields.array(
          fields.object({
            // Identificador antigo, não usado pelo site: fica fora da tela, mas o valor
            // que já existe no JSON é mantido ao salvar (depoimento novo sai sem "id").
            id: fields.ignored(),
            initial: fields.text({
              label: 'Inicial (letra no círculo)',
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
          }),
          {
            label: 'Depoimentos',
            description:
              'De 1 a 6 (no computador ficam 2 por linha: use número par). O bloco de depoimentos só aparece no site se "Mostrar depoimentos" estiver marcado em "Seções: ordem e visibilidade". Use apenas depoimentos reais e autorizados.',
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
              description: 'Também vai para o Google (dados estruturados de FAQ). Escreva frases completas.',
              validation: { isRequired: true, length: { max: 450 } },
            }),
          }),
          {
            label: 'Perguntas e respostas',
            description: 'Arraste para mudar a ordem. Precisa ter pelo menos uma; para tirar a seção do site, esconda-a em "Seções: ordem e visibilidade".',
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
        menu: fields.array(
          fields.object({
            texto: textoObrigatorio('Texto no menu', 20),
            secao: fields.select({
              label: 'Leva para a seção',
              options: opcoesSecaoDoMenu,
              defaultValue: 'ProblemSolution',
            }),
          }),
          {
            label: 'Itens do menu (topo e celular)',
            description:
              'Arraste para mudar a ordem. Se a seção estiver escondida em "Seções: ordem e visibilidade", o item some do menu sozinho. Use até 6 (no computador o menu fica numa linha só).',
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
          { label: 'Link do portal dos pais (barra azul e menu do celular)' },
        ),
        portalAluno: fields.object(
          {
            texto: textoObrigatorio('Texto', 25),
            link: fields.url({ label: 'Link', validation: { isRequired: true } }),
          },
          { label: 'Link do portal do aluno (barra azul e menu do celular)' },
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
            sufixoFixo: textoObrigatorio('Texto depois do telefone fixo', 20, { description: 'Ex.: (Fixo). Endereço e telefones vêm de "Dados da escola".' }),
            sufixoWhatsapp: textoObrigatorio('Texto depois do WhatsApp', 20, { description: 'Ex.: (WhatsApp).' }),
            whatsappAssunto: textoObrigatorio('Assunto da mensagem no WhatsApp (link do rodapé)', 120, { description: ajudaWhatsapp }),
            tituloMapa: textoObrigatorio('Título da coluna do mapa', 30),
            mapaRotulo: textoObrigatorio('Nome do mapa', 80, { description: 'Lido por leitores de tela.' }),
            mapaEmbed: fields.text({
              label: 'Link do mapa incorporado',
              description:
                'No Google Maps: Compartilhar → Incorporar um mapa → copie só o endereço que está dentro de src="...". Começa com https://www.google.com/maps/embed?pb=',
              validation: {
                isRequired: true,
                length: { max: 1000 },
                pattern: { regex: /^https:\/\/www\.google\.com\/maps\/embed\?pb=\S+$/, message: 'Use o link de "Incorporar um mapa" do Google Maps (https://www.google.com/maps/embed?pb=...).' },
              },
            }),
            direitos: textoObrigatorio('Linha de direitos (depois do ©)', 100, { description: 'Ex.: 2026 Escola Prisma. Todos os direitos reservados.' }),
          },
          { label: 'Rodapé', description: 'O slogan abaixo do logotipo é o de "Dados da escola".' },
        ),
      },
    }),

    // ---------------------------------------------------- Página 404
    pagina404: singleton({
      label: 'Página não encontrada (404)',
      path: 'src/content/site/pagina-404',
      format: { data: 'json' },
      schema: {
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
          description: 'Opcional (ex.: 1997). Preencha só com o ano confirmado. Vazio = não aparece no Google.',
          validation: { length: { max: 4 }, pattern: { regex: /^(\d{4})?$/, message: 'Use 4 dígitos (ex.: 1997) ou deixe vazio.' } },
        }),
        endereco: fields.object(
          {
            logradouro: fields.text({ label: 'Rua / logradouro', validation: { isRequired: true, length: { max: 100 } } }),
            cidade: fields.text({ label: 'Cidade', validation: { isRequired: true, length: { max: 60 } } }),
            uf: fields.text({ label: 'Estado (UF)', validation: { isRequired: true, length: { min: 2, max: 2 } } }),
            cep: fields.text({
              label: 'CEP',
              validation: { isRequired: true, pattern: { regex: /^\d{5}-\d{3}$/, message: 'Use o formato 00000-000.' } },
            }),
            pais: fields.text({
              label: 'País (código)',
              description: 'Código de 2 letras. Brasil = BR.',
              validation: { isRequired: true, length: { min: 2, max: 2 } },
            }),
          },
          {
            label: 'Endereço',
            description: 'Mantenha idêntico ao Perfil da Empresa no Google.',
          },
        ),
        geo: fields.object(
          {
            latitude: campoCoordenada('Latitude', 90),
            longitude: campoCoordenada('Longitude', 180),
          },
          { label: 'Coordenadas no mapa', description: 'Mesmo ponto do Perfil no Google, com 5 a 7 casas decimais.' },
        ),
        mapaUrl: fields.url({ label: 'Link do mapa (Google Maps)', validation: { isRequired: true } }),
        telefoneFixo: fields.object(
          {
            exibicao: fields.text({ label: 'Como aparece no site', description: 'Ex.: (75) 3622-9180', validation: { isRequired: true, length: { max: 20 } } }),
            e164: fields.text({
              label: 'Formato internacional',
              description: 'Ex.: +557536229180 (com +55, sem espaços).',
              validation: { isRequired: true, pattern: { regex: /^\+\d{10,15}$/, message: 'Use + seguido só de números.' } },
            }),
          },
          { label: 'Telefone fixo' },
        ),
        whatsapp: fields.object(
          {
            exibicao: fields.text({ label: 'Como aparece no site', description: 'Ex.: (75) 99895-4848', validation: { isRequired: true, length: { max: 20 } } }),
            numero: fields.text({
              label: 'Número para o link',
              description: 'Só números, com 55 e DDD. Ex.: 5575998954848',
              validation: { isRequired: true, pattern: { regex: /^\d{10,15}$/, message: 'Use só números.' } },
            }),
            e164: fields.text({
              label: 'Formato internacional',
              description: 'Ex.: +5575998954848 (com +55, sem espaços).',
              validation: { isRequired: true, pattern: { regex: /^\+\d{10,15}$/, message: 'Use + seguido só de números.' } },
            }),
          },
          { label: 'WhatsApp' },
        ),
        email: fields.text({
          label: 'E-mail',
          validation: { isRequired: true, length: { max: 100 }, pattern: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido.' } },
        }),
        instagram: fields.object(
          {
            usuario: fields.text({ label: 'Usuário', description: 'Com @. Ex.: @escolaprisma_ (aparece na seção Instagram).', validation: { isRequired: true, length: { max: 40 } } }),
            url: fields.url({ label: 'Link do perfil', validation: { isRequired: true } }),
          },
          { label: 'Instagram' },
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
            'Caminho de uma imagem que já está em public/ (1200x630), começando com /. Ex.: /assets/escola-prisma-marca-1200x630.png. Se o arquivo não existir, a publicação falha (o site no ar não muda). Trocar o arquivo da imagem é com o desenvolvedor.',
          validation: { isRequired: true, length: { max: 200 }, pattern: { regex: /^\/[^\s]+\.(png|jpe?g|webp)$/, message: 'Use um caminho como /assets/nome-da-imagem.png' } },
        }),
        ogImageAlt: textoObrigatorio('Descrição da imagem de compartilhamento', 120, { description: 'Lida por leitores de tela quando o link é compartilhado.' }),
        descricaoEscola: textoObrigatorio('Descrição da escola para o Google e IAs', 400, {
          multiline: true,
          description: 'Não aparece na página: vai nos dados estruturados (schema School). Só fatos confirmados.',
        }),
        temas: fields.array(textoObrigatorio('Tema', 60), {
          label: 'Temas que a escola domina (Google e IAs)',
          description: 'De 1 a 20. Não aparecem na página: vão nos dados estruturados (knowsAbout).',
          itemLabel: (props) => props.value || 'Tema',
          validation: { length: { min: 1, max: 20 } },
        }),
      },
    }),
  },
});
