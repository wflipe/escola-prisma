/**
 * Middleware do Astro: só mexe nas páginas do painel de edição (/keystatic).
 *
 * O Keystatic não tem API de tema. Para o painel usar as cores e a fonte da escola,
 * este middleware acrescenta <link rel="stylesheet" href="/painel/painel.css"> e o script
 * /painel/traducao.js (textos em português) ao HTML de /keystatic e /keystatic/*.
 * Tudo o mais passa direto, sem alteração:
 * - páginas pré-renderizadas (home, 404, llms.txt, sitemaps): saem iguais no build;
 * - /api/keystatic/* (login e gravação) e qualquer resposta que não seja HTML.
 */
import { defineMiddleware } from 'astro:middleware';

// Visual (painel.css) e tradução dos textos que o Keystatic deixa em inglês (traducao.js).
const ESTILO_DO_PAINEL =
  '<link rel="stylesheet" href="/painel/painel.css"><script src="/painel/traducao.js" charset="utf-8" defer></script>';
const ROTA_DO_PAINEL = /^\/keystatic(\/|$)/;

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered || !ROTA_DO_PAINEL.test(context.url.pathname)) return next();

  const resposta = await next();
  if (!(resposta.headers.get('content-type') ?? '').includes('text/html')) return resposta;

  const html = await resposta.text();
  // A página do Keystatic não tem <head>: o link entra logo depois do <!DOCTYPE html>
  // (antes dele, o navegador sairia do modo padrão).
  const comEstilo = html.includes('<head>')
    ? html.replace('<head>', `<head>${ESTILO_DO_PAINEL}`)
    : html.replace(/^(\s*<!DOCTYPE html>)?/i, `$1${ESTILO_DO_PAINEL}`);

  const cabecalhos = new Headers(resposta.headers);
  cabecalhos.delete('content-length');
  return new Response(comEstilo, { status: resposta.status, statusText: resposta.statusText, headers: cabecalhos });
});
