/**
 * Tipos dos arquivos de conteúdo em src/content/**.json.
 * Todo arquivo tem um objeto na raiz (nunca um array), formato que o painel
 * Keystatic grava. Listas ficam em { "items": [...] } ou numa chave com nome
 * próprio (ex.: "cartoes"). Cada arquivo é uma tela do painel (keystatic.config.ts).
 *
 * Convenções usadas em vários arquivos:
 * - titulo + tituloDestaque: o trecho tituloDestaque (primeira ocorrência dentro
 *   do título) sai em serifa itálica; quebra de linha no título vira <br />
 *   (ver partesDoTitulo() em src/utils/titulo.ts; cada seção renderiza as partes).
 * - whatsappAssunto: completa a frase "Olá! Vim pelo site da Escola Prisma e
 *   gostaria de ___." (link montado por whatsappLink() em src/data/escola.ts).
 */

/** Botão que abre o WhatsApp. O link é montado por whatsappLink() em src/data/escola.ts (número em src/content/site/escola.json). */
export interface WhatsAppCTA {
  text: string;
  /** Versão curta do texto, usada no celular (telas abaixo de 640px). Opcional. */
  textCurto?: string;
  /** Completa a frase "Olá! Vim pelo site da Escola Prisma e gostaria de ___." */
  whatsappAssunto: string;
}

/** Cartão com ícone, título e texto (ícones de src/components/ui/Icon.astro). */
export interface CartaoIcone {
  icone: string;
  titulo: string;
  texto: string;
}

/** Indicador de confiança do Hero (aparecem juntos numa linha, separados por " · ", com uma estrela na frente). */
export interface TrustIndicator {
  text: string;
}

/** Cartão de foto do Hero. */
export interface CartaoFotoHero {
  /** Nome em destaque no cartão (ex.: "Balé Infantil"). */
  rotulo: string;
  /** Mostra uma estrela dourada depois do rótulo. */
  estrela: boolean;
  /** Frase curta abaixo do rótulo (aparece em maiúsculas). */
  frase: string;
  /** Nome do arquivo em src/assets/images/ (ex.: "Balé 1024 x 1024.webp"). */
  imagem: string;
  /** Texto alternativo da foto (leitores de tela e Google). */
  textoAlternativo: string;
}

export interface HeroData {
  badge: string;
  headline: string;
  /** Trecho do headline exibido em serifa itálica dourada. */
  headlineHighlight?: string;
  subheadline: string;
  primaryCTA: WhatsAppCTA;
  trustIndicators: TrustIndicator[];
  /** Os 3 cartões de foto à direita (posições fixas no layout). */
  cartoes: {
    cartao1: CartaoFotoHero;
    cartao2: CartaoFotoHero;
    cartao3: CartaoFotoHero;
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

/** src/content/faqs/faqs.json */
export interface FAQData {
  titulo: string;
  items: FAQItem[];
}

export interface Phase {
  title: string;
  slug: string;
  phaseLabel: string;
  icon: string;
  color: 'amarela' | 'laranja' | 'azul' | 'carvao';
  description: string;
  ctaText: string;
  whatsappAssunto: string;
}

/** src/content/site/phases.json (seção "Fases de ensino", #etapas). */
export interface PhasesData {
  selo: string;
  titulo: string;
  tituloDestaque?: string;
  texto: string;
  /** Frase em itálico abaixo dos cartões. */
  assinatura: string;
  items: Phase[];
}

export interface EcosystemItem {
  icon: string;
  title: string;
  description: string;
}

/** src/content/site/ecosystem.json (seção "Diferenciais", #ecossistema). */
export interface EcosystemData {
  titulo: string;
  tituloDestaque?: string;
  texto: string;
  textoBotao: string;
  whatsappAssunto: string;
  items: EcosystemItem[];
}

export interface MatriculasData {
  /** false esconde o banner sem precisar apagar nada. */
  ativo: boolean;
  selo: string;
  titulo: string;
  /** Trecho do título exibido em destaque. */
  tituloDestaque?: string;
  texto: string;
  etapas: string[];
  cta: WhatsAppCTA;
  /**
   * Botão secundário. "mostrar": false esconde o botão sem apagar os textos;
   * quando o botão aparece, o painel omite a chave (por isso é opcional).
   */
  ctaSecundario?: WhatsAppCTA & { mostrar?: boolean };
  observacao?: string;
  /** Faixa fina no topo de todas as páginas. Só aparece se o banner (ativo) e a faixa (faixaTopo.ativo) estiverem ligados. */
  faixaTopo?: {
    ativo: boolean;
    texto: string;
    /** Chamada no computador/tablet. */
    chamada: string;
    /** Chamada no celular (telas estreitas). */
    chamadaCurta: string;
    link: string;
  };
}

/** Lista genérica gravada como { "items": [...] }. */
export interface ListaDeItens<T> {
  items: T[];
}

/** Item de "Por que escolher a Prisma" (src/content/site/why-items.json). */
export interface WhyItem {
  icon: string;
  title: string;
  description: string;
}

/** src/content/site/why-items.json (bloco "Por que escolher a Prisma", seção #depoimentos). */
export interface WhyItemsData {
  titulo: string;
  texto: string;
  items: WhyItem[];
}

/** Depoimento de família (src/content/testimonials/testimonials.json). */
export interface Testimonial {
  /** Identificador antigo, não usado pelo site. O painel mantém o valor que já existe (fields.ignored); depoimento novo vem sem. */
  id?: string;
  initial: string;
  name: string;
  role: string;
  text: string;
}

/** src/content/testimonials/testimonials.json (bloco "O que dizem as famílias"). */
export interface TestimonialsData {
  titulo: string;
  texto: string;
  items: Testimonial[];
}

/** src/content/site/secao-proposta.json (seção "A Escola", #proposta). Cores dos cartões seguem a posição. */
export interface PropostaData {
  selo: string;
  titulo: string;
  tituloDestaque?: string;
  texto: string;
  cartoes: CartaoIcone[];
}

/** src/content/site/secao-manifesto.json */
export interface ManifestoData {
  selo: string;
  titulo: string;
  tituloDestaque?: string;
  texto: string;
  botao: WhatsAppCTA;
}

/** src/content/site/secao-valores.json (seção "Valores cristãos", #valores-cristaos). Cores dos cartões seguem a posição. */
export interface ValoresData {
  selo: string;
  titulo: string;
  tituloDestaque?: string;
  texto: string;
  cartoes: CartaoIcone[];
}

/** src/content/site/secao-rotina.json (seção "Rotina", #rotina). */
export interface RotinaData {
  titulo: string;
  texto: string;
  itens: CartaoIcone[];
  video: {
    /** ID do vídeo no YouTube (parte depois de "watch?v=" no link). */
    youtubeId: string;
    /** Título do vídeo (usado no botão de play e no player). */
    titulo: string;
    /** Texto alternativo da capa do vídeo. */
    textoAlternativo: string;
  };
}

/** src/content/site/secao-instagram.json (seção "Instagram", #instagram). O @ e o link vêm de escola.json. */
export interface InstagramData {
  titulo: string;
  tituloDestaque?: string;
  texto: string;
}

/** src/content/site/secao-chamada-final.json */
export interface ChamadaFinalData {
  titulo: string;
  tituloDestaque?: string;
  texto: string;
  botao: WhatsAppCTA;
  apoio: string;
  /** Linha pequena abaixo do texto de apoio. */
  microTexto: string;
}

/** Link externo (portais), com texto e endereço. */
export interface LinkExterno {
  texto: string;
  link: string;
}

/** Item do menu: aponta para uma seção da página. Some sozinho se a seção estiver desligada. */
export interface ItemMenu {
  texto: string;
  secao: SecaoId;
}

/** src/content/site/menu-rodape.json (menu do topo, menu do celular, barra azul, rodapé e botão flutuante). */
export interface MenuRodapeData {
  menu: ItemMenu[];
  /** Botão "Fale Conosco" do topo e do menu do celular. */
  botaoContato: WhatsAppCTA;
  portalPais: LinkExterno;
  portalAluno: LinkExterno;
  /** Botão redondo do WhatsApp no canto da tela. */
  botaoFlutuante: {
    /** Nome lido por leitores de tela (o botão só tem o ícone). */
    rotulo: string;
    whatsappAssunto: string;
  };
  rodape: {
    tituloContato: string;
    /** Sufixo depois do telefone fixo, ex.: "(Fixo)". */
    sufixoFixo: string;
    /** Sufixo depois do WhatsApp, ex.: "(WhatsApp)". */
    sufixoWhatsapp: string;
    whatsappAssunto: string;
    tituloMapa: string;
    /** Título do mapa para leitores de tela. */
    mapaRotulo: string;
    /** Link "Incorporar um mapa" do Google Maps (src do iframe). */
    mapaEmbed: string;
    /** Texto depois do símbolo ©. */
    direitos: string;
  };
}

/** src/content/site/pagina-404.json */
export interface Pagina404Data {
  tituloAba: string;
  descricao: string;
  titulo: string;
  texto: string;
  botaoInicio: string;
  botaoWhatsapp: WhatsAppCTA;
}

/**
 * Dados oficiais da Escola Prisma (src/content/site/escola.json).
 *
 * Mantenha estes dados IDÊNTICOS aos do Perfil da Empresa no Google e das redes
 * sociais: buscadores e assistentes de IA confiam mais quando nome, endereço,
 * telefone e site batem em todos os lugares.
 */
export interface EscolaData {
  nome: string;
  /**
   * Domínio oficial, sem barra no final. Precisa ser igual ao `site` do
   * astro.config.mjs (o build falha se forem diferentes). Fora do painel: o
   * Keystatic preserva o valor ao salvar (fields.ignored).
   */
  site: string;
  /** Também aparece no rodapé, abaixo do logotipo. */
  slogan: string;
  /**
   * Ano de fundação (ex.: '1997'). Preencher só com o ano confirmado.
   * Opcional: o painel Keystatic omite a chave quando o campo fica vazio.
   */
  anoFundacao?: string;
  endereco: {
    logradouro: string;
    cidade: string;
    uf: string;
    cep: string;
    /** Código do país (ISO 3166), ex.: 'BR'. */
    pais: string;
  };
  /**
   * Ponto do Perfil no Google (Plus Code P343+2P; mesmas coordenadas do mapa do rodapé), 5 casas decimais.
   * Gravado como número no JSON; o painel edita como texto (ver campoCoordenada em keystatic.config.ts).
   */
  geo: { latitude: number; longitude: number };
  mapaUrl: string;
  /** exibicao: como aparece no site; e164: formato internacional usado em links tel: e no schema. */
  telefoneFixo: { exibicao: string; e164: string };
  /** numero: só dígitos, usado no link wa.me. */
  whatsapp: { exibicao: string; numero: string; e164: string };
  email: string;
  instagram: { usuario: string; url: string };
  /** URL completa da página no Facebook. */
  facebook: string;
}

/** SEO e compartilhamento da página inicial (src/content/site/seo.json). */
export interface SeoData {
  /** <title>, og:title e twitter:title da home; também vai no schema WebPage. */
  titulo: string;
  /** meta description, og:description e twitter:description da home. */
  descricao: string;
  /** Imagem de compartilhamento (og:image), caminho dentro de public/, 1200x630. Também é a imagem da escola no schema. O build falha se o arquivo não existir. */
  ogImage: string;
  /** og:image:alt e twitter:image:alt (todas as páginas). */
  ogImageAlt: string;
  /** Descrição da escola no schema School (Google e assistentes de IA). */
  descricaoEscola: string;
  /** Assuntos que a escola domina (knowsAbout no schema School). */
  temas: string[];
}

/**
 * Seções da página inicial que podem ser ligadas/desligadas e reordenadas.
 * Hero (topo) e Matrículas (EnrollmentBanner) ficam fixos no início da página:
 * o Hero tem o único <h1> e o banner de matrículas já tem a chave "ativo"
 * própria em src/content/site/matriculas.json.
 *
 * Os itens do menu (menu-rodape.json) apontam para uma SecaoId; quando a seção
 * está desligada, o item some do menu (src/data/secoes.ts).
 */
export type SecaoId =
  | 'ProblemSolution'
  | 'Manifesto'
  | 'ChristianValues'
  | 'DailyRoutine'
  | 'Phases'
  | 'Ecosystem'
  | 'SocialProof'
  | 'FAQ'
  | 'SocialFeed'
  | 'FinalCTA';

/** src/content/site/secoes.json */
export interface SecoesData {
  /**
   * Ordem dos itens = ordem na página. ativo: false esconde a seção.
   * Seção repetida: vale só a primeira ocorrência. Seção ausente: fica escondida.
   */
  items: Array<{ secao: SecaoId; ativo: boolean }>;
  /**
   * Bloco "O que dizem as famílias", dentro da seção SocialProof (#depoimentos).
   * Fica separado do "ativo" da seção porque a SocialProof também mostra
   * "Por que escolher a Prisma", que está no ar. Só ligar com depoimentos
   * reais e autorizados.
   */
  mostrarDepoimentos: boolean;
}
