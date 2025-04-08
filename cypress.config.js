import { defineConfig } from "cypress";
import viteDevServer from "@cypress/vite-dev-server";

export default defineConfig({
  projectId: 'risdcr',
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig: "client/vite.config.js",
    },
  },
});
