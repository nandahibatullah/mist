import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.test.ts", "**/*.test.tsx"],
    globals: true,
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src/"),
      "@server": path.resolve(__dirname, "./src/server/"),
    },
  },
});
