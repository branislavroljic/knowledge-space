/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_STANDARD_FIELD_MAX_LENGTH: number;
  readonly VITE_LONGER_FILED_MAX_LENGHT: number;
  readonly VITE_MAX_FILE_SIZE: number;
  readonly VITE_EMAIL: string;
}

interface ImportMeta {
  readonly: ImportMetaEnv;
}
