/**
 * Fonte única dos dados oficiais da Escola Prisma.
 *
 * Mantenha estes dados IDÊNTICOS aos do Perfil da Empresa no Google e das redes
 * sociais: buscadores e assistentes de IA confiam mais quando nome, endereço,
 * telefone e site batem em todos os lugares.
 */
export const escola = {
  nome: 'Escola Prisma',
  site: 'https://www.escolaprisma.net.br',
  slogan: 'Educar é ensinar a pensar sozinho.',
  /** Ano de fundação (ex.: '1997'). Vazio = não informado. Preencher só com o ano confirmado. */
  anoFundacao: '' as string,
  endereco: {
    logradouro: 'Caminho 16 - Tomba',
    cidade: 'Feira de Santana',
    uf: 'BA',
    cep: '44091-554',
    pais: 'BR',
  },
  /** Ponto do Perfil no Google (Plus Code P343+2P; mesmas coordenadas do mapa do rodapé), 5 casas decimais. */
  geo: { latitude: -12.29491, longitude: -38.94568 },
  mapaUrl: 'https://maps.google.com/?cid=11423172969059973375',
  telefoneFixo: { exibicao: '(75) 3622-9180', e164: '+557536229180' },
  whatsapp: { exibicao: '(75) 99895-4848', numero: '5575998954848', e164: '+5575998954848' },
  email: 'secretaria@escolaprisma.com',
  instagram: { usuario: '@escolaprisma_', url: 'https://www.instagram.com/escolaprisma_/' },
  facebook: 'https://www.facebook.com/prismafeiraVII',
} as const;

export const enderecoCompleto = `${escola.endereco.logradouro}, ${escola.endereco.cidade} - ${escola.endereco.uf}, ${escola.endereco.cep}`;

/**
 * Monta o link do WhatsApp com mensagem padronizada, escrita na voz de quem
 * envia (o pai/responsável):
 *   "Olá! Vim pelo site da Escola Prisma e gostaria de <assunto>."
 *
 * A resposta de boas-vindas da escola fica na saudação automática do
 * WhatsApp Business (ver docs/WHATSAPP-SAUDACAO.md).
 */
export function whatsappLink(assunto: string): string {
  const texto = `Olá! Vim pelo site da Escola Prisma e gostaria de ${assunto}.`;
  return `https://wa.me/${escola.whatsapp.numero}?text=${encodeURIComponent(texto)}`;
}
