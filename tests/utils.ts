import fs from 'fs-extra';
import path from 'path';
import rimraf from 'rimraf';

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toHaveBeenWarned(): R;
      toHaveBeenMatched(): R;
    }
  }
}

export function callWarn(error = false) {
  let warn: jest.SpyInstance;
  expect.extend({
    toHaveBeenWarned() {
      const pass = warn.mock.calls.some((v) => {
        return v.length;
      });
      if (pass) {
        return {
          pass: true,
          message: () => `${error ? 'error' : 'warn'} called`
        };
      } else {
        return {
          pass: false,
          message: () => `${error ? 'error' : 'warn'} not called`
        };
      }
    },
    toHaveBeenMatched(reg: RegExp) {
      const file = fs
        .readFileSync(
          path.resolve(process.cwd(), 'tests/views/.invoke/router.js')
        )
        .toString();
      const pass = reg.test(file);
      if (pass) {
        return {
          pass: true,
          message: () => `matched`
        };
      } else {
        return {
          pass: false,
          message: () => `not matched in ${file}`
        };
      }
    }
  });

  beforeEach(() => {
    warn = jest.spyOn(console, error ? 'error' : 'warn');
    warn.mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
  });
}

export function make(add: string) {
  fs.outputFileSync(path.resolve(process.cwd(), 'tests/views', add), '');
}

export function clear() {
  rimraf.sync(path.resolve(process.cwd(), 'tests/views'));
  fs.mkdirsSync(path.resolve(process.cwd(), 'tests/views'));
}
