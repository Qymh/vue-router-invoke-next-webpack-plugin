import chalk from 'chalk';

let hasError = false;

type Log = {
  type: 'log' | 'error';
  message: string;
};

export const logs: Log[] = [];

export function printLogs() {
  logs.forEach((v) => {
    console[v.type](v.message);
  });
  logs.length = 0;
}

export function resetHasError() {
  hasError = false;
}

export function success(path?: string) {
  if (hasError) {
    return;
  }
  const message = chalk.green(
    `
[vue-router-invoke-next-webpack-plugin] ${`successed build ${path} at ${new Date().toLocaleTimeString()}`}
      `
  );
  logs.push({
    type: 'log',
    message
  });
}

export function error(code: ErrorCodes, details?: string) {
  hasError = true;
  const message = chalk.red(
    `
[vue-router-invoke-next-webpack-plugin] [${errorMessages[code]}] ${details}
      `
  );
  logs.push({
    type: 'error',
    message
  });
}

export function warn(code: ErrorCodes, details?: string) {
  console.warn(
    chalk.yellow(
      `
[vue-router-invoke-next-webpack-plugin] [${errorMessages[code]}] ${details}
      `
    )
  );
}

/* eslint-disable no-unused-vars */
export const enum ErrorCodes {
  WRONG_OPTIONS,
  INVALID_ROUTE_RULE,
  YAML_PARSE_ERROR
}
/* eslint-enable no-unused-vars */

export const errorMessages = {
  [ErrorCodes.WRONG_OPTIONS]: 'wrong options',
  [ErrorCodes.INVALID_ROUTE_RULE]: 'invalid route rule',
  [ErrorCodes.YAML_PARSE_ERROR]: 'yaml parse error'
};
