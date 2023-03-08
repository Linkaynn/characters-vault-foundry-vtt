import { resolve } from 'path';
import { defineConfig } from 'vite';

const config = {
  development: {
    entry: resolve(__dirname, 'src/index.development.ts'),
    name: 'character-vault-foundry.development',
    fileName: 'character-vault-foundry.development',
  },
  production: {
    entry: resolve(__dirname, 'src/index.production.ts'),
    name: 'character-vault-foundry.production',
    fileName: 'character-vault-foundry.production',
  },
};

const currentConfig = config[process.env.NODE_ENV];

if (currentConfig === undefined) {
  throw new Error('NODE_ENV is not defined or is not valid');
}

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    minify: false,
    emptyOutDir: false,
    lib: {
      ...currentConfig,
      formats: ['cjs'],
    },
  },
});
