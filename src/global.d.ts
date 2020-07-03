import { Options } from './invoke';

declare namespace NodeJS {
  interface ProcessEnv {
    INVOKE_OPTIONS: Options;
  }
}
