import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.escolaprisma.net.br',
  // Site estático: "/" e "/404" são pré-renderizados no build. O adapter da
  // Vercel existe só para as rotas do painel (/keystatic e /api/keystatic),
  // que o Keystatic injeta com prerender = false (rodam como função).
  output: 'static',
  adapter: vercel(),
  integrations: [
    mdx(),
    react(),
    keystatic(),
    // O painel não entra no sitemap (e recebe noindex pelo vercel.json).
    sitemap({
      lastmod: new Date(),
      filter: (page) => !/^\/(keystatic|api)(\/|$)/.test(new URL(page).pathname),
    }),
    compress()
  ],
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
  // Fontes baixadas no build e servidas pelo próprio site (sem depender do
  // fonts.googleapis.com na hora de abrir a página). Astro gera fallbacks com
  // métricas ajustadas, o que reduz o "pulo" do texto quando a fonte carrega.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Bricolage Grotesque',
      cssVariable: '--font-bricolage',
      weights: [400, 600, 700, 800],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Montserrat',
      cssVariable: '--font-montserrat',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Instrument Serif',
      cssVariable: '--font-instrument',
      weights: [400],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['serif'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
    // Só afeta o "npm run dev": sem isto o painel /keystatic não abre no
    // computador ("react-dom/client does not provide an export named createRoot").
    optimizeDeps: { include: ['react-dom/client'] },
    // Também só no "npm run dev": a pasta .vercel/ (saída do build) não deve ser
    // vigiada. No Windows, um build feito com o caminho em "d:" minúsculo cria
    // links que apontam para a própria pasta, e o vigia entra em loop (ver README).
    server: { watch: { ignored: ['**/.vercel/**'] } }
  }
});
