import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Read env vars like VITE_API_TARGET from .env, .env.development, etc.
  const env = loadEnv(mode, process.cwd(), "");
  const API_TARGET = env.VITE_API_TARGET || "http://localhost:5000"; // Flask server

  return {
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler"]],
        },
      }),
    ],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        // Forward /api/* from Vite -> Next backend to avoid CORS in dev
        "/api": {
          target: API_TARGET,
          changeOrigin: true,
        },
      },
    },
  };
});
