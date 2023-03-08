import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    minify: false,
    lib: {
      formats: ['cjs'],
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'character-vault-foundry',
      fileName: 'character-vault-foundry',
    },
  },
});
