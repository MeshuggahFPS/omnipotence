export interface IAppConfig {
  baseURL: string;
  endpoints: Endpoints;
  appVersion: string;
  environment: ConfigEnvironment;
}

interface Endpoints {
  api: string;
}

export type ConfigEnvironment = 'Development' | 'Test' | 'Production';
