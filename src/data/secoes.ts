/**
 * Seções da página inicial: quais estão ligadas e em que ordem. Lê
 * src/content/site/secoes.json (painel: "Seções: ordem e visibilidade").
 *
 * Regras que tornam qualquer edição no painel segura:
 * - seção repetida na lista: vale só a primeira ocorrência (sem ids duplicados);
 * - seção que não está na lista (ou com valor desconhecido): fica escondida.
 */
import type { SecaoId, SecoesData } from '../types/content';
import secoesData from '../content/site/secoes.json';
import { nomeDaSecao } from './nomes-secoes';

export { nomeDaSecao, ancoraDaSecao } from './nomes-secoes';

export const secoes = secoesData as SecoesData;

/** Seções ligadas, na ordem do secoes.json, sem repetição (a primeira ocorrência vence). */
export const secoesAtivas: SecaoId[] = (() => {
  const vistas = new Set<string>();
  const ativas: SecaoId[] = [];
  for (const item of secoes.items) {
    if (!(item.secao in nomeDaSecao) || vistas.has(item.secao)) continue;
    vistas.add(item.secao);
    if (item.ativo) ativas.push(item.secao);
  }
  return ativas;
})();

export const secaoAtiva = (secao: SecaoId) => secoesAtivas.includes(secao);
