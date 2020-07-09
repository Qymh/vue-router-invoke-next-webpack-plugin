declare global {
  namespace jest {
    interface Matchers<R, T> {
      toHaveBeenWarned(): R;
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
