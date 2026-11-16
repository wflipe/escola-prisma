/**
 * Nome em português e âncora (#id) de cada seção da página inicial.
 * Usado pelo site (src/data/secoes.ts, menu) e pelo painel (keystatic.config.ts),
 * por isso não importa nenhum JSON.
 */
import type { SecaoId } from '../types/content';

/** Nome de cada seção como aparece no painel. */
export const nomeDaSecao: Record<SecaoId, string> = {
  ProblemSolution: 'A Escola (proposta)',
  Manifesto: 'Manifesto',
  ChristianValues: 'Valores cristãos',
  DailyRoutine: 'Rotina e vídeo',
  Phases: 'Fases de ensino',
  Ecosystem: 'Diferenciais',
  SocialProof: 'Famílias (por que a Prisma e depoimentos)',
  FAQ: 'Dúvidas (perguntas frequentes)',
  SocialFeed: 'Instagram',
  FinalCTA: 'Chamada final (visita)',
};

/** Âncora (id no HTML) das seções que podem ser destino de um item do menu. Manifesto e Chamada final não têm. */
export const ancoraDaSecao: Partial<Record<SecaoId, string>> = {
  ProblemSolution: 'proposta',
  ChristianValues: 'valores-cristaos',
  DailyRoutine: 'rotina',
  Phases: 'etapas',
  Ecosystem: 'ecossistema',
  SocialProof: 'depoimentos',
  FAQ: 'faq',
  SocialFeed: 'instagram',
};
