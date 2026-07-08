// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build
export default defineConfig({
  site: 'https://tantara.wiki',
  integrations: [mdx()],
});
