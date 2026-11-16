/**
 * Menu, barra azul, rodapé e botão flutuante (src/content/site/menu-rodape.json,
 * tela "Menu e rodapé" do painel).
 *
 * Os itens do menu apontam para uma seção; se ela estiver desligada em
 * secoes.json, o item some do menu (evita link sem destino).
 */
import type { MenuRodapeData } from '../types/content';
import menuRodapeData from '../content/site/menu-rodape.json';
import { ancoraDaSecao, secaoAtiva } from './secoes';

export const menuRodape = menuRodapeData as MenuRodapeData;

/** Itens do menu cuja seção está ligada e tem âncora, já com o href (#id). */
export const itensMenu: Array<{ texto: string; href: string }> = menuRodape.menu.flatMap((item) => {
  const ancora = ancoraDaSecao[item.secao];
  return ancora && secaoAtiva(item.secao) ? [{ texto: item.texto, href: `#${ancora}` }] : [];
});
