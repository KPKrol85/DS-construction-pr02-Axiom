import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The contact form, lightbox, and navigation are DOM components, so the
    // focused suite runs against jsdom.
    environment: "jsdom",
    environmentOptions: {
      jsdom: {
        // js/components/forms.js takes its local (no-network) submission path
        // when location.hostname is localhost, so the URL is pinned here to
        // keep that branch deterministic.
        url: "http://localhost/",
      },
    },
    include: ["tests/**/*.test.js"],
  },
});
