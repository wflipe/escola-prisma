import { escola } from '../data/escola';

export interface SchemaOrg {
  '@context': 'https://schema.org';
  '@type': string | string[];
  [key: string]: unknown;
}

/**
 * Ficha da escola para buscadores e assistentes de IA.
 * Os dados vêm de src/data/escola.ts e devem bater com o Perfil da Empresa no Google.
 */
export function educationalOrganizationSchema(): SchemaOrg {
  return {
    '@context': 'https://schema.org',
    '@type': 'School',
    '@id': `${escola.site}/#escola`,
    name: escola.nome,
    url: escola.site,
    logo: `${escola.site}/assets/logo.png`,
    image: `${escola.site}/assets/escola-prisma-marca-1200x630.png`,
    slogan: escola.slogan,
    description:
      'Escola particular em Feira de Santana (BA), da Educação Infantil ao Ensino Médio, com opção de turno integral. Ensino com o Sistema Positivo, inglês com Positivo English Solution, Balé, Karatê, esporte e acompanhamento próximo de cada aluno.',
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
    areaServed: { '@type': 'City', name: 'Feira de Santana' },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: escola.whatsapp.e164,
        contactType: 'admissions',
        name: 'Matrículas e atendimento (WhatsApp)',
        areaServed: 'BR',
        availableLanguage: 'Portuguese',
      },
      {
        '@type': 'ContactPoint',
        telephone: escola.telefoneFixo.e164,
        contactType: 'customer service',
        name: 'Secretaria e Coordenação (telefone fixo)',
        email: escola.email,
        areaServed: 'BR',
        availableLanguage: 'Portuguese',
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
