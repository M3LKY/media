import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Get rid of the CORS error
    proxy: {
      "/api": {
        target: "https://mediaserver-e8ef.vercel.app",
      },
      "/socket.io": {
        target: "https://mediaserver-e8ef.vercel.app",
        ws: true,
      },
    },
  },
});
