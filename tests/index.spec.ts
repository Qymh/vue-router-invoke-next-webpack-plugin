import { callWarn } from './utils';
import Invoke from '../src';
import path from 'path';
const defaultViews = path.resolve(process.cwd(), 'tests/views');

describe('wrong options', () => {
  callWarn(true);

  it('root', () => {
    // @ts-ignore
    new Invoke({});
    expect('').toHaveBeenWarned();
  });

  it('version', () => {
    new Invoke({
      root: defaultViews,
      // @ts-ignore
      version: '4'
    });
    expect('').toHaveBeenWarned();
  });

  it('language', () => {
    new Invoke({
      root: defaultViews,
      // @ts-ignore,
      language: 'ts'
    });
    expect('').toHaveBeenWarned();
  });

  it('mode', () => {
    new Invoke({
      root: defaultViews,
      // @ts-ignore,
      mode: 'test'
    });
    expect('').toHaveBeenWarned();
  });
});
