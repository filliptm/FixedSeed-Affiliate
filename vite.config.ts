import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };
  const appEnvironment = env.VITE_APP_ENV?.trim().toLowerCase();
  const isHostedNonProduction =
    Boolean(appEnvironment) &&
    appEnvironment !== "production" &&
    appEnvironment !== "local";

  if (isHostedNonProduction) {
    for (const name of [
      "VITE_API_BASE",
      "VITE_AUTH0_DOMAIN",
      "VITE_AUTH0_CLIENT_ID",
      "VITE_AUTH0_AUDIENCE",
    ]) {
      if (!env[name]) throw new Error(`${name} is required for ${appEnvironment}`);
    }
    if (env.VITE_API_BASE?.replace(/\/$/, "") === "https://api.fixedseed.com") {
      throw new Error(`${appEnvironment} cannot use the production Fixed Seed API`);
    }
    if (
      env.VITE_AUTH0_AUDIENCE?.replace(/\/$/, "") ===
      "https://api.fixedseed.com"
    ) {
      throw new Error(`${appEnvironment} cannot use the production Auth0 audience`);
    }
  }

  return {
    plugins: [react()],
    server: {
      port: 7392,
    },
  };
});
