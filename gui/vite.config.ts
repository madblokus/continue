import path from "path"
import react from "@vitejs/plugin-react-swc";
<<<<<<< HEAD
import { defineConfig } from "vite";
=======
import tailwindcss from "tailwindcss";
import { defineConfig } from "vitest/config";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Change the output .js filename to not include a hash
    rollupOptions: {
      // external: ["vscode-webview"],
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
<<<<<<< HEAD
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
=======
  server: {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["*", "Content-Type", "Authorization"],
      credentials: true,
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/util/test/setupTests.ts",
  },
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
});
