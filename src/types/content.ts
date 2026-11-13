/** Tipos dos arquivos de conteúdo em src/content/**.json */

/** Botão que abre o WhatsApp. O link é montado por whatsappLink() em src/data/escola.ts. */
export interface WhatsAppCTA {
  text: string;
  /** Completa a frase "Olá! Vim pelo site da Escola Prisma e gostaria de ___." */
  whatsappAssunto: string;
}

export interface TrustIndicator {
  icon: string;
  text: string;
}

export interface HeroData {
  badge: string;
  headline: string;
  /** Trecho do headline exibido em serifa itálica dourada. */
  headlineHighlight?: string;
  subheadline: string;
  primaryCTA: WhatsAppCTA;
  trustIndicators: TrustIndicator[];
}

export interface FAQItem {
  question: string;
  answer: string;
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

export interface EcosystemItem {
  icon: string;
  title: string;
  description: string;
}

export interface EcosystemData {
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
  ctaSecundario?: WhatsAppCTA;
  observacao?: string;
}
