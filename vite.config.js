import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // Ativa a geração de source maps
  },
  server: {
    port: 5173, // Defina a porta que seu servidor de desenvolvimento usará
    open: true,  // Abre o navegador automaticamente quando o servidor é iniciado
  },
});