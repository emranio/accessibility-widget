import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: { react: 'src/react/index.tsx' },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ['react', 'react-dom'],
    outExtension({ format }) {
      return { js: format === 'esm' ? '.esm.js' : '.cjs.js' }
    },
  },
])
