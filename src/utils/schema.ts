export interface SchemaOrg {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: unknown;
}

export function educationalOrganizationSchema(): SchemaOrg {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Escola Prisma',
    url: 'https://www.escolaprisma.com',
    logo: 'https://www.escolaprisma.com/assets/logo.png',
    description: 'A Escola Prisma em Feira de Santana oferece desenvolvimento completo, acolhimento e excelência acadêmica. Do ensino infantil ao médio.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Caminho 16, Conjunto Feira VII, 16 - Tomba',
      addressLocality: 'Feira de Santana',
      addressRegion: 'BA',
      postalCode: '44100-000',
      addressCountry: 'BR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+55-75-3622-9180',
      contactType: 'Atendimento à Coordenação e Secretaria',
      email: 'secretaria@escolaprisma.com',
      areaServed: 'Feira de Santana',
      availableLanguage: 'Portuguese',
    },
    sameAs: [
      'https://www.instagram.com/escolaprisma_',
      'https://www.facebook.com/prismafeiraVII',
    ],
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

export function courseSchema(course: {
  name: string;
  description: string;
  provider: string;
  url: string;
}): SchemaOrg {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'EducationalOrganization',
      name: course.provider,
    },
    url: course.url,
  };
}