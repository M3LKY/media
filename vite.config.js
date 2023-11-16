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
        target: "https://connectserver-c64m.onrender.com",
      },
      "/socket.io": {
        target: "https://connectserver-c64m.onrender.com",
        ws: true,
      },
    },
  },
});
