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
      `[vue-router-invoke-next-webpack-plugin] ${`successed build ${path} at ${new Date().toLocaleTimeString()}`}`
    )
  );
}

export function error(code: ErrorCodes, details?: string) {
  hasError = true;
  console.log(
    chalk.red(
      `
      [vue-router-invoke-next-webpack-plugin] [${code}] ${details}
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
  console.log(
    chalk.yellow(
      `
      [vue-router-invoke-next-webpack-plugin] [${code}] ${details}
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
  [ErrorCodes.WRONG_OPTIONS]: 'Wrong Options',
  [ErrorCodes.INVALID_ROUTE_RULE]: 'Invalid Route Rule',
  [ErrorCodes.YAML_PARSE_ERROR]: 'Yaml Parse Error'
};
