import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { viteSingleFile } from 'vite-plugin-singlefile'


const { generate: gasEntryGenerator } = require('gas-entry-generator');

function gasPlugin() {
  return {
    name: 'gas-plugin',
    transform(code, id) {
      // Check if file is a JavaScript file
      if (id.endsWith('.js')) {
        // Add comment to beginning of code
        const transformedCode = `console.log("HELLO");\n${code}`;

        // Return the transformed code
        return {
          code: transformedCode,
          map: null
        };
      }
    }
  };
};

export default defineConfig({

  plugins: [vue(), vueJsx(), viteSingleFile()],
  root: './src/vue_sidebar/',
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    minify: false,
    rollupOptions: {
      input: fileURLToPath(new URL('./src/vue_sidebar/vue_sidebar.html', import.meta.url)),
      output: {
        dir: 'dist',
        entryFileNames: '[name].js',
        assetFileNames: '[name][extname]'
      },
    },
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/vue_sidebar/src/', import.meta.url))
    }
  }
})
