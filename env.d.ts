declare namespace NodeJS {
  export interface ProcessEnv {
    MQTT_BROKER: string;
    DB_HOST: string;
    DB_PORT?: number;
    DB_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;
    NODE_ENV?: string;
    ADDRESS?: string;
    PORT?: string;
    DEBUG?: string;
  }
}