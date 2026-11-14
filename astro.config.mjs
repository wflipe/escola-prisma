import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.escolaprisma.net.br',
  integrations: [
    mdx(),
    sitemap({ lastmod: new Date() }),
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
    plugins: [tailwindcss()]
  }
});
