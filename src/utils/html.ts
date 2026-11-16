/**
 * Escapa texto para HTML deixando "&" solto (seguido de espaço) como está.
 *
 * O Astro escapa todo "&" como "&amp;". Os dois aparecem iguais no navegador,
 * mas o HTML do site antes do painel tinha "EXPRESSÃO & DISCIPLINA" com "&" solto;
 * esta função mantém o HTML idêntico. "&" seguido de letra, número ou "#"
 * (que poderia formar uma entidade, ex.: "&copy") continua escapado.
 */
export function escaparTexto(texto: string): string {
  return texto
    .replace(/&(?=[#a-zA-Z0-9])/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
