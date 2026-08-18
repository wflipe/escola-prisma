import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.escolaprisma.com',
  integrations: [
    mdx(),
    sitemap(),
    compress()
  ],
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
  prefetch: { prefetchAll: true },
  vite: {
    plugins: [tailwindcss()]
  }
});