import fs from 'node:fs';
import path from 'node:path';

/**
 * Confere, na hora do build, que um caminho escrito no painel (ex.: "/assets/x.png")
 * aponta para um arquivo que existe em public/. Sem isso, um erro de digitação
 * passaria despercebido e o link de compartilhamento ficaria sem imagem.
 */
export function exigirArquivoPublico(caminho: string, ondeEsta: string): void {
  const arquivo = path.join(process.cwd(), 'public', decodeURIComponent(caminho.split(/[?#]/)[0]));
  if (!fs.existsSync(arquivo) || !fs.statSync(arquivo).isFile()) {
    throw new Error(
      `Arquivo "${caminho}" (${ondeEsta}) não existe em public/. ` +
        `Corrija o caminho no painel ou coloque o arquivo em public${caminho}.`,
    );
  }
}
