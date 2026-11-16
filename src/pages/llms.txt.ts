/**
 * /llms.txt: resumo da escola em texto simples, para assistentes de IA
 * (ver docs/SEO-GEO.md). Gerado no build, a partir dos mesmos arquivos que o
 * painel edita, para não ficar desatualizado:
 * - nome, slogan, site, endereço, mapa, telefones, e-mail e redes: escola.json
 *   (tela "Dados da escola");
 * - linha de matrículas: matriculas.json (com o banner ligado, começa com o
 *   selo do banner, ex.: "Matrículas abertas."; desligado, a frase sai sem ele).
 *
 * O texto de apresentação e os resumos de etapas e diferenciais ficam aqui
 * (escritos para IA, mais curtos que os da página). Ao mudar etapas ou
 * diferenciais no painel, peça ao desenvolvedor para conferir estas listas.
 */
import type { APIRoute } from 'astro';
import { escola } from '../data/escola';
import type { MatriculasData } from '../types/content';
import matriculasData from '../content/site/matriculas.json';

export const prerender = true;

const matriculas = matriculasData as MatriculasData;

const nomesDePais: Record<string, string> = { BR: 'Brasil' };

export const GET: APIRoute = () => {
  const { endereco } = escola;
  const pais = nomesDePais[endereco.pais] ?? endereco.pais;
  const contato = `fale pelo WhatsApp ${escola.whatsapp.exibicao}`;
  const linhaMatriculas = matriculas.ativo
    ? `${matriculas.selo}. Para agendar uma visita guiada ou pedir informações sobre vagas, ${contato}.`
    : `Para agendar uma visita guiada ou pedir informações sobre vagas, ${contato}.`;

  const linhas = [
    `# ${escola.nome}`,
    '',
    `> Escola particular em ${endereco.cidade} (Bahia), da Educação Infantil ao Ensino Médio, com opção de turno integral. Ensino com o Sistema Positivo, inglês com o Positivo English Solution, esporte, Balé, Karatê, valores cristãos e acompanhamento próximo de cada aluno. Slogan: "${escola.slogan}"`,
    '',
    '## Dados oficiais',
    '',
    `- Nome: ${escola.nome}`,
    `- Site oficial: ${escola.site}`,
    `- Endereço: ${endereco.logradouro}, ${endereco.cidade} - ${endereco.uf}, CEP ${endereco.cep}, ${pais}`,
    `- Mapa: ${escola.mapaUrl}`,
    `- WhatsApp (matrículas e atendimento): ${escola.whatsapp.exibicao}`,
    `- Telefone fixo (secretaria e coordenação): ${escola.telefoneFixo.exibicao}`,
    `- E-mail: ${escola.email}`,
    `- Instagram: ${escola.instagram.url}`,
    `- Facebook: ${escola.facebook}`,
    '',
    '## Etapas de ensino',
    '',
    '- Educação Infantil: alfabetização lúdica e estruturada, estímulo sensorial e socialização.',
    '- Ensino Fundamental I: hábito diário de estudos, raciocínio lógico, inglês integrado e autonomia.',
    '- Ensino Fundamental II: investigação científica, projetos interdisciplinares e amadurecimento socioemocional.',
    '- Ensino Médio: preparação para o ENEM, a UEFS e os principais vestibulares, com orientação vocacional.',
    '',
    '## Diferenciais',
    '',
    '- Turno integral opcional, com estudo orientado, esportes, Balé, Karatê, projetos práticos, alimentação e descanso.',
    '- Material didático e metodologia do Sistema Positivo.',
    '- Inglês com o Positivo English Solution, integrado à grade curricular.',
    '- Turmas planejadas para acompanhamento individual e equipe psicopedagógica.',
    '- Comunicação direta dos pais com a coordenação pelo WhatsApp e pelo portal Serviço aos Pais.',
    '- Formação humana baseada em valores cristãos.',
    '',
    '## Matrículas e visitas',
    '',
    `- ${linhaMatriculas}`,
    '',
    '## Páginas',
    '',
    `- [Página inicial](${escola.site}/): apresentação da escola, etapas de ensino, estrutura, depoimentos e perguntas frequentes.`,
  ];

  return new Response(linhas.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
