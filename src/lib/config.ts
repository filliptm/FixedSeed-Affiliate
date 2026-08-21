const configuredEnvironment = import.meta.env.VITE_APP_ENV?.trim().toLowerCase();

export const APP_ENV =
  configuredEnvironment || (import.meta.env.DEV ? "local" : "production");

export const IS_NON_PRODUCTION =
  APP_ENV !== "production" && APP_ENV !== "local";

function required(name: string, value: string | undefined): string {
  const normalized = value?.trim();
  if (!normalized) throw new Error(`${name} is required`);
  return normalized.replace(/\/$/, "");
}

export const API_BASE = required("VITE_API_BASE", import.meta.env.VITE_API_BASE);
export const AUTH0_DOMAIN = required(
  "VITE_AUTH0_DOMAIN",
  import.meta.env.VITE_AUTH0_DOMAIN
);
export const AUTH0_CLIENT_ID = required(
  "VITE_AUTH0_CLIENT_ID",
  import.meta.env.VITE_AUTH0_CLIENT_ID
);
export const AUTH0_AUDIENCE = required(
  "VITE_AUTH0_AUDIENCE",
  import.meta.env.VITE_AUTH0_AUDIENCE
);

if (IS_NON_PRODUCTION && API_BASE === "https://api.fixedseed.com") {
  throw new Error(`${APP_ENV} cannot use the production Fixed Seed API`);
}

if (IS_NON_PRODUCTION && AUTH0_AUDIENCE === "https://api.fixedseed.com") {
  throw new Error(`${APP_ENV} cannot use the production Auth0 API audience`);
}
