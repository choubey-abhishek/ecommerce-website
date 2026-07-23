import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

/**
 * Vitest config for unit + component tests. Playwright (playwright.config.ts)
 * owns end-to-end tests separately — these two suites are intentionally
 * split so `npm test` stays fast enough to run on every save, while
 * `npm run test:e2e` (slower, needs a running server) is reserved for CI
 * and pre-release checks.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    css: false,
    exclude: ["node_modules", ".next", "e2e", "**/*.spec.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["lib/**", "utils/**", "context/**", "components/**", "hooks/**"],
      exclude: ["**/*.d.ts", "**/*.config.*"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
