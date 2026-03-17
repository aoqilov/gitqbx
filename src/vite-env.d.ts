/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_ENV: "development" | "production";
  readonly VITE_ENABLE_DEVTOOLS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
