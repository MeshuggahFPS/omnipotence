import Config from 'react-native-config';

import packageJson from '../package.json';
import {ConfigEnvironment, IAppConfig} from './config.types';

const config: IAppConfig = {
  baseURL: Config.BASE_URL ?? '',
  endpoints: {
    api: Config.ENDPPINTS ?? '',
  },
  appVersion: packageJson.version,
  environment: (Config.ENV as ConfigEnvironment) ?? 'Development',
};

export default config;
