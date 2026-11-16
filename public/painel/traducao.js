/*
 * Tradução dos textos do painel (/keystatic) que o Keystatic deixa fixos em inglês.
 *
 * O Keystatic já traduz parte da interface (locale 'pt-BR' em keystatic.config.ts), mas
 * botões como "Save", "Reset", "Done" e "Remove" estão escritos direto no código dele.
 * Este script troca esses textos depois que a tela aparece e a cada mudança na tela.
 *
 * Regras de segurança:
 * - só troca textos que sejam EXATAMENTE iguais a uma entrada do dicionário;
 * - nunca mexe em campos de digitação (input, textarea, contenteditable), para não
 *   alterar o conteúdo que o ADM escreve;
 * - não muda nada que é gravado: é só o que aparece na tela.
 *
 * Carregado só nas páginas do painel, por src/middleware.ts. Se o Keystatic mudar um
 * texto numa atualização, ele volta a aparecer em inglês (nada quebra); basta incluir aqui.
 */
(() => {
  const textos = {
    // Ações principais
    Save: 'Salvar',
    Create: 'Criar',
    Reset: 'Desfazer',
    'Reset changes': 'Desfazer altera\u00e7\u00f5es',
    Done: 'Concluir',
    Cancel: 'Cancelar',
    Remove: 'Remover',
    Edit: 'Editar',
    'Edit item': 'Editar item',
    'Add item': 'Adicionar item',
    Add: 'Adicionar',
    Insert: 'Inserir',
    Options: 'Op\u00e7\u00f5es',
    Preview: 'Ver pr\u00e9via',
    'Choose file': 'Escolher arquivo',
    'Remove Image': 'Remover imagem',
    'Edit Image Options': 'Op\u00e7\u00f5es da imagem',
    'Image details': 'Detalhes da imagem',
    'Alt text': 'Texto alternativo',
    'File name': 'Nome do arquivo',
    Filename: 'Nome do arquivo',
    Width: 'Largura',
    Height: 'Altura',
    'Constrain proportions': 'Manter propor\u00e7\u00e3o',

    // Estados e avisos
    Unsaved: 'N\u00e3o salvo',
    Changed: 'Alterado',
    'Saving changes': 'Salvando altera\u00e7\u00f5es',
    'Checking\u2026': 'Verificando\u2026',
    Authenticating: 'Entrando',
    'Loading Item': 'Carregando item',
    'Loading Entries': 'Carregando',
    'Empty list': 'Lista vazia',
    'Add the first item to see it here.': 'Adicione o primeiro item para ele aparecer aqui.',
    'Contains invalid fields. Please edit.': 'H\u00e1 campos com problema. Clique para corrigir.',
    'Are you sure? This action cannot be undone.': 'Tem certeza? N\u00e3o d\u00e1 para desfazer.',
    'You have unsaved changes. Save this entry to duplicate it.':
      'H\u00e1 altera\u00e7\u00f5es n\u00e3o salvas. Salve antes de duplicar.',
    'Not found': 'N\u00e3o encontrado',
    'Entry not found.': 'Conte\u00fado n\u00e3o encontrado.',
    'Invalid state': 'Estado inv\u00e1lido',
    'No results\u2026': 'Nenhum resultado\u2026',

    // Menus do cabeçalho e da conta
    Dashboard: 'Painel',
    Account: 'Conta',
    'Log out': 'Sair',
    'User menu': 'Menu da conta',
    'Open app navigation': 'Abrir o menu',
    'View on GitHub': 'Ver no GitHub',
    'Copy entry': 'Copiar conte\u00fado',
    'Paste entry': 'Colar conte\u00fado',
    'Duplicate entry\u2026': 'Duplicar\u2026',
    'Delete entry\u2026': 'Excluir\u2026',
    'Log in with GitHub': 'Entrar com o GitHub',
    'Branch name': 'Nome do branch',
    'Create branch and save': 'Criar branch e salvar',
    'Creating Branch': 'Criando branch',
    Status: 'Situa\u00e7\u00e3o',
  };

  const ATRIBUTOS = ['aria-label', 'title', 'placeholder'];
  const PROIBIDO = 'input, textarea, [contenteditable], [contenteditable] *';

  function traduzirTexto(no) {
    const original = no.nodeValue;
    const limpo = original.trim();
    const novo = textos[limpo];
    if (!novo) return;
    const pai = no.parentElement;
    if (!pai || pai.closest(PROIBIDO)) return;
    no.nodeValue = original.replace(limpo, novo);
  }

  function traduzirAtributos(el) {
    if (el.matches(PROIBIDO) && !el.matches('input, textarea')) return;
    for (const nome of ATRIBUTOS) {
      const valor = el.getAttribute(nome);
      if (valor && textos[valor]) el.setAttribute(nome, textos[valor]);
    }
  }

  function percorrer(raiz) {
    if (raiz.nodeType === Node.TEXT_NODE) return traduzirTexto(raiz);
    if (raiz.nodeType !== Node.ELEMENT_NODE) return;
    traduzirAtributos(raiz);
    const andarilho = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    while (andarilho.nextNode()) {
      const no = andarilho.currentNode;
      if (no.nodeType === Node.TEXT_NODE) traduzirTexto(no);
      else traduzirAtributos(no);
    }
  }

  function iniciar() {
    percorrer(document.body);
    new MutationObserver((mudancas) => {
      for (const m of mudancas) {
        if (m.type === 'characterData') traduzirTexto(m.target);
        else if (m.type === 'attributes') traduzirAtributos(m.target);
        else m.addedNodes.forEach(percorrer);
      }
    }).observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATRIBUTOS,
    });
  }

  if (document.body) iniciar();
  else document.addEventListener('DOMContentLoaded', iniciar);
})();
