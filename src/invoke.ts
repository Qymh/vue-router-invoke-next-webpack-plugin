import { Compiler } from 'webpack';
import path from 'path';
import { RouterOptions } from 'vue-router';
import { generate } from './generate';
import { ErrorCodes, error } from './error';
import { replacePostfix, camelize, isDir } from './utils';
import chalk from 'chalk';

declare var __TEST__: boolean;

export type WeakOptions = {
  // watch directory
  root: string;
  // alias
  alias?: string;
  version?: '2' | '3' | 2 | 3;
  // output file
  dist?: string;
  // js language
  language?: 'javascript' | 'typescript';
  // route mode
  mode?: 'history' | 'hash';

  getRelativePath?: (path: string) => string;

  // raw vue-router options
  scrollBehavior?: RouterOptions['scrollBehavior'];
};

export type Options = Required<WeakOptions>;

export const defaultOptions: WeakOptions = {
  root: '',
  alias: 'Invoke',
  version: '3',
  dist: '',
  language: 'javascript',
  mode: 'history'
};

function validateOptions(options: WeakOptions) {
  const { root, language, version, mode } = options;
  try {
    isDir(root);
  } catch (e) {
    error(ErrorCodes.WRONG_OPTIONS, 'root option must be a directory');
    return false;
  }
  if (+version! !== 2 && +version! !== 3) {
    error(
      ErrorCodes.WRONG_OPTIONS,
      `version option can only be ${chalk.red(2)} for vue2 or be ${chalk.red(
        3
      )} for vue3`
    );
    return false;
  }
  if (language !== 'javascript' && language !== 'typescript') {
    error(
      ErrorCodes.WRONG_OPTIONS,
      'language option can only be javascript or typescript'
    );
    return false;
  }
  if (mode !== 'history' && mode !== 'hash') {
    error(ErrorCodes.WRONG_OPTIONS, 'mode option can only be history or hash');
    return false;
  }
  return true;
}

function normalizeOptions(options: WeakOptions) {
  options = { ...defaultOptions, ...options };

  if (!validateOptions(options)) {
    if (!__TEST__) {
      process.exit(0);
    }
  }

  const { root } = options;
  options.getRelativePath = generateGetRelativePathFn(root);
  options.dist = options.dist || root + `/.invoke`;

  return options as Options;
}

function generateGetRelativePathFn(root: Options['root']) {
  return (directory: string) => {
    return camelize(
      replacePostfix(
        '/' +
          path
            .relative(root, directory)
            .replace(/\/(_)?([a-zA-Z0-9])/g, (_, d: string, c: string) => {
              return c ? `/${d || ''}${c.toLowerCase()}` : `${d || ''}${c}`;
            })
      )
    );
  };
}

export class Invoke {
  private $options: Options;

  constructor(options: WeakOptions) {
    const normalizedOptions = normalizeOptions(options);
    this.$options = normalizedOptions;
  }

  apply(compiler: Compiler) {
    // webpack4
    if (compiler.hooks?.entryOption) {
      compiler.hooks.entryOption.tap('invoke', () => {
        generate(this.$options);
      });
    }
    // webpack3
    else {
      compiler.plugin('entry-option', () => {
        generate(this.$options);
      });
    }
  }

  test() {
    generate(this.$options);
  }
}
