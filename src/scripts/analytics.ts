/**
 * Eventos de conversão para o Umami (https://cloud.umami.is), o Microsoft Clarity e o
 * Google Tag Manager/GA4 (via dataLayer: evento com parâmetro "local").
 *
 * Registra cliques em:
 *  - elementos com data-ga4-event (nome do evento) e data-ga4-location (onde fica);
 *  - qualquer link de WhatsApp (wa.me) sem data-ga4-event → evento "click_whatsapp";
 *  - links de telefone (tel:) → evento "click_telefone".
 *
 * O local é data-ga4-location ou, se faltar, o id da seção/header/footer mais próximo.
 * Se nenhuma ferramenta estiver carregada (bloqueador, ambiente local), nada acontece.
 */
type UmamiTracker = { track: (event: string, data?: Record<string, string>) => void };
type ClarityFn = (...args: unknown[]) => void;
type DataLayer = Record<string, unknown>[];

function localDoElemento(el: Element): string {
  const explicito = el.getAttribute('data-ga4-location');
  if (explicito) return explicito;
  const bloco = el.closest('section[id], header, footer, nav[id]');
  return bloco?.id || bloco?.tagName.toLowerCase() || 'pagina';
}

document.addEventListener(
  'click',
  (e) => {
    const w = window as unknown as { umami?: UmamiTracker; clarity?: ClarityFn; dataLayer?: DataLayer };
    if (!w.umami && !w.clarity && !w.dataLayer) return;

    const alvo = (e.target as Element | null)?.closest('a, button');
    if (!alvo) return;

    const href = alvo.getAttribute('href') ?? '';
    let evento = alvo.getAttribute('data-ga4-event');
    if (!evento && href.includes('wa.me/')) evento = 'click_whatsapp';
    if (!evento && href.startsWith('tel:')) evento = 'click_telefone';
    if (!evento) return;

    const local = localDoElemento(alvo);
    w.umami?.track(evento, { local });
    // No GTM: acionador "Evento personalizado" com o nome do evento; "local" vira variável da camada de dados.
    w.dataLayer?.push({ event: evento, local });
    // No Clarity, o evento marca a gravação: dá para filtrar "sessões que clicaram no WhatsApp".
    w.clarity?.('event', evento);
    w.clarity?.('set', 'ultimo_clique_local', local);
  },
  { capture: true },
);
