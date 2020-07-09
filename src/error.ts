import chalk from 'chalk';

let hasError = false;

export function resetHasError() {
  hasError = false;
}

export function success(path?: string) {
  if (hasError) {
    return;
  }
  console.log(
    chalk.green(
      `
[vue-router-invoke-next-webpack-plugin] ${`successed build ${path} at ${new Date().toLocaleTimeString()}`}
      `
    )
  );
}

export function error(code: ErrorCodes, details?: string) {
  hasError = true;
  console.error(
    chalk.red(
      `
[vue-router-invoke-next-webpack-plugin] [${errorMessages[code]}] ${details}
      `
    )
  );
}

export function warn(
  code: ErrorCodes,
  before?: string,
  raw?: any,
  details?: string
) {
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
