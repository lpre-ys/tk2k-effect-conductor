import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// テスト環境で画像インポートをファイル名文字列として返すプラグイン（CRA の Jest 挙動に合わせる）
function imageStubPlugin() {
  return {
    name: 'image-stub',
    transform(_, id) {
      if (/\.(png|jpg|jpeg|gif|svg|webp|ico)$/.test(id)) {
        const filename = id.split('/').pop();
        return `export default "${filename}";`;
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    process.env.VITEST ? imageStubPlugin() : null,
  ].filter(Boolean),
  base: './',
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/\/konva\/|\/react-konva\/|\/use-image\//.test(id)) return 'vendor-konva';
          if (/\/react\/|\/react-dom\/|\/react-redux\/|\/react-hook-form\/|\/react-i18next\//.test(id)) return 'vendor-react';
          if (/\/@reduxjs\//.test(id)) return 'vendor-redux';
          if (/\/@emotion\/|\/react-color\/|\/react-dropzone\/|\/@fortawesome\//.test(id)) return 'vendor-ui';
          if (/\/chroma-js\/|\/d3-ease\/|\/i18next\/|\/deepmerge\//.test(id)) return 'vendor-misc';
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    server: {
      deps: {
        inline: ['konva', 'd3-ease', 'chroma-js'],
      },
    },
    coverage: {
      exclude: [
        'src/index.jsx',
        'src/app/store.js',
        'src/konva/**',
      ],
    },
  },
});
