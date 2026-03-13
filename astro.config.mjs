import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://ZJkyle.github.io',
  vite: {
    plugins: [tailwindcss()],
  },
});
