/**
 * Divide um título editável em partes para o componente renderizar:
 * - o trecho `destaque` (primeira ocorrência) vira uma parte com destaque: true,
 *   que o componente envolve num <span> em serifa itálica;
 * - cada quebra de linha do título vira { quebra: true }, renderizada como <br />.
 *
 * O <span> e o <br /> precisam ser escritos no próprio componente da seção (e não
 * num componente à parte) para receberem o atributo de estilo escopado dele.
 */
export type ParteTitulo = { quebra: true } | { quebra?: false; texto: string; destaque: boolean };

export function partesDoTitulo(titulo: string, destaque?: string): ParteTitulo[] {
  const idx = destaque ? titulo.indexOf(destaque) : -1;
  const trechos =
    idx >= 0 && destaque
      ? [
          { texto: titulo.slice(0, idx), destaque: false },
          { texto: destaque, destaque: true },
          { texto: titulo.slice(idx + destaque.length), destaque: false },
        ]
      : [{ texto: titulo, destaque: false }];

  const partes: ParteTitulo[] = [];
  for (const trecho of trechos) {
    const linhas = trecho.texto.split(/\r?\n/);
    linhas.forEach((linha, i) => {
      if (i > 0) partes.push({ quebra: true });
      // Espaços colados na quebra de linha não aparecem no navegador; tirar evita diferença no HTML.
      let texto = linha;
      if (i < linhas.length - 1) texto = texto.replace(/\s+$/, '');
      if (i > 0) texto = texto.replace(/^\s+/, '');
      if (texto) partes.push({ texto, destaque: trecho.destaque });
    });
  }
  return partes;
}
