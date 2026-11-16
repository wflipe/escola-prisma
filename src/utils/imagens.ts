/**
 * Imagens escolhidas pelo painel (campo de imagem do Keystatic).
 *
 * O painel grava em src/assets/images/ e guarda no JSON só o nome do arquivo
 * (ex.: "Balé 1024 x 1024.webp"). Aqui o nome vira o import da imagem, para o
 * <Image> do astro:assets continuar otimizando (redimensiona, gera 1x/2x e hash).
 */
import type { ImageMetadata } from 'astro';

// O glob do Vite diferencia maiúsculas de minúsculas: cada letra da extensão
// aceita as duas formas (uma foto "X.JPG" também vale). Arquivos de outros tipos
// (gif, heic...) ficam de fora do glob, para não quebrar o build ao importar.
const imagens = import.meta.glob<ImageMetadata>(
  '../assets/images/*.{[wW][eE][bB][pP],[pP][nN][gG],[jJ][pP][gG],[jJ][pP][eE][gG],[aA][vV][iI][fF]}',
  { eager: true, import: 'default' },
);

/** Devolve a imagem de src/assets/images/<arquivo>. Falha o build com mensagem clara se o arquivo não existir. */
export function imagemDoConteudo(arquivo: string, ondeEsta: string): ImageMetadata {
  const nome = arquivo.replace(/^.*[\\/]/, '');
  const imagem = imagens[`../assets/images/${nome}`];
  if (!imagem) {
    throw new Error(
      `Imagem "${arquivo}" (${ondeEsta}) não encontrada em src/assets/images/. ` +
        `Escolha a imagem de novo no painel ou coloque o arquivo nessa pasta.`,
    );
  }
  return imagem;
}
