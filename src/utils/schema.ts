import { escola } from '../data/escola';

export interface SchemaOrg {
  '@context': 'https://schema.org';
  '@type'?: string | string[];
  [key: string]: unknown;
}

/** Endereço da home exatamente como a canonical (com a barra final). */
const HOME = `${escola.site}/`;
const ID_ESCOLA = `${escola.site}/#escola`;
const ID_SITE = `${escola.site}/#website`;
const ID_IMAGEM = `${escola.site}/#imagem-principal`;

/**
 * Ficha da escola para buscadores e assistentes de IA, num único grafo:
 * School (a escola) <- WebSite (publicado pela escola) <- WebPage (a home, sobre a escola).
 * Os dados vêm de src/data/escola.ts e devem bater com o Perfil da Empresa no Google.
 */
export function siteGraphSchema(page: { title: string; description: string }): SchemaOrg {
  return {
    '@context': 'https://schema.org',
    '@graph': [schoolNode(), websiteNode(), webPageNode(page)],
  };
}

function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': ID_SITE,
    url: HOME,
    name: escola.nome,
    inLanguage: 'pt-BR',
    publisher: { '@id': ID_ESCOLA },
  };
}

function webPageNode(page: { title: string; description: string }) {
  return {
    '@type': 'WebPage',
    '@id': `${HOME}#webpage`,
    url: HOME,
    name: page.title,
    description: page.description,
    inLanguage: 'pt-BR',
    isPartOf: { '@id': ID_SITE },
    about: { '@id': ID_ESCOLA },
    primaryImageOfPage: { '@id': ID_IMAGEM },
  };
}

function schoolNode() {
  return {
    '@type': 'School',
    '@id': ID_ESCOLA,
    name: escola.nome,
    url: HOME,
    logo: {
      '@type': 'ImageObject',
      url: `${escola.site}/assets/logo-square.png`,
      width: 512,
      height: 512,
      caption: escola.nome,
    },
    image: {
      '@type': 'ImageObject',
      '@id': ID_IMAGEM,
      url: `${escola.site}/assets/escola-prisma-marca-1200x630.png`,
      width: 1200,
      height: 630,
    },
    slogan: escola.slogan,
    description:
      'Escola particular em Feira de Santana (BA), da Educação Infantil ao Ensino Médio, com opção de turno integral. Ensino com o Sistema Positivo, inglês com Positivo English Solution, Balé, Karatê, esporte e acompanhamento próximo de cada aluno.',
    // Deve ser o MESMO telefone principal do Perfil da Empresa no Google (ver docs/AUDITORIA-SEO-2026-11.md).
    telephone: escola.whatsapp.e164,
    email: escola.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: escola.endereco.logradouro,
      addressLocality: escola.endereco.cidade,
      addressRegion: escola.endereco.uf,
      postalCode: escola.endereco.cep,
      addressCountry: escola.endereco.pais,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: escola.geo.latitude,
      longitude: escola.geo.longitude,
    },
    hasMap: escola.mapaUrl,
    areaServed: { '@type': 'City', name: escola.endereco.cidade },
    ...(escola.anoFundacao ? { foundingDate: escola.anoFundacao } : {}),
    knowsAbout: [
      'Educação Infantil',
      'Ensino Fundamental I',
      'Ensino Fundamental II',
      'Ensino Médio',
      'Turno integral',
      'Sistema Positivo',
      'Positivo English Solution',
      'Preparação para o ENEM e a UEFS',
      'Balé',
      'Karatê',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: escola.whatsapp.e164,
        contactType: 'admissions',
        name: 'Matrículas e atendimento (WhatsApp)',
        areaServed: 'BR',
        availableLanguage: 'pt-BR',
      },
      {
        '@type': 'ContactPoint',
        telephone: escola.telefoneFixo.e164,
        contactType: 'customer service',
        name: 'Secretaria e Coordenação (telefone fixo)',
        email: escola.email,
        areaServed: 'BR',
        availableLanguage: 'pt-BR',
      },
    ],
    sameAs: [escola.instagram.url, escola.facebook],
  };
}

export function faqPageSchema(faqs: Array<{ question: string; answer: string }>): SchemaOrg {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
