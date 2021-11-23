declare namespace NodeJS {
  export interface ProcessEnv {
    DB_HOST?: string;
    DB_PORT?: string;
    DB_NAME?: string;
    DB_USER?: string;
    DB_PASSWORD?: string;
    DB_FILENAME?: string;
    NODE_ENV?: string;
    ADDRESS?: string;
    SWAGGER_ADDRESS?: string;
    PORT?: string;
    DEBUG?: string;
  }
}