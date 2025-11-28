import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';

export default defineConfig({
  root: '.',          
  base: './',         
  server: {
    port: 5173,
  },
  plugins: [babel()], 
});
