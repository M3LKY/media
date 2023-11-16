import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
<<<<<<< HEAD
      "/api": {
        target: import.meta.env.VITE_CONNECTO_API,
=======
      '/api': {
        target: 'https://connectserver-c64m.onrender.com',
>>>>>>> 29fb411f6aa1dd26c31b96acc58dc34df715c4e0
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    rollupOptions: {
      external: ['https://connectserver-c64m.onrender.com']
    }
  }
});
