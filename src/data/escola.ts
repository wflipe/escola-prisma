/**
 * Dados oficiais da Escola Prisma e gerador de links do WhatsApp.
 *
 * Os dados ficam em src/content/site/escola.json (editável pelo painel);
 * a descrição de cada campo está na interface EscolaData, em src/types/content.ts.
 * Mantenha estes dados IDÊNTICOS aos do Perfil da Empresa no Google e das redes
 * sociais: buscadores e assistentes de IA confiam mais quando nome, endereço,
 * telefone e site batem em todos os lugares.
 */
import type { EscolaData } from '../types/content';
import escolaData from '../content/site/escola.json';

export const escola: EscolaData = escolaData;

// "site" fica fora do painel (fields.ignored) e precisa ser igual ao `site` do
// astro.config.mjs, usado na canonical e no sitemap. Diferença = build falha.
const siteDoAstro = String(import.meta.env.SITE ?? '').replace(/\/+$/, '');
if (siteDoAstro && escola.site !== siteDoAstro) {
  throw new Error(
    `O "site" de src/content/site/escola.json (${escola.site}) é diferente do "site" do astro.config.mjs (${siteDoAstro}). Deixe os dois iguais.`,
  );
}

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
