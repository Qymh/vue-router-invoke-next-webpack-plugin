import { callWarn, make, clear } from './utils';
import Invoke from '../src';
import path from 'path';
import fs from 'fs-extra';
import { printLogs } from '../src/error';
const defaultViews = path.resolve(process.cwd(), 'tests/views');

describe('wrong cases', () => {
  callWarn(true);

  it('root', () => {
    // @ts-ignore
    new Invoke({});
    printLogs();
    expect('').toHaveBeenWarned();
  });

  it('version', () => {
    new Invoke({
      root: defaultViews,
      // @ts-ignore
      version: '4'
    });
    printLogs();
    expect('').toHaveBeenWarned();
  });

  it('language', () => {
    new Invoke({
      root: defaultViews,
      // @ts-ignore,
      language: 'ts'
    });
    printLogs();
    expect('').toHaveBeenWarned();
  });

  it('mode', () => {
    new Invoke({
      root: defaultViews,
      // @ts-ignore,
      mode: 'test'
    });
    printLogs();
    expect('').toHaveBeenWarned();
  });

  it('root is not a directory', () => {
    const i = new Invoke({
      root: defaultViews
    });
    i.test();
    printLogs();
    expect('').toHaveBeenWarned();
  });

  it('wrong name of directory', () => {
    make('index.vue');
    make('index/index.vue');
    const i = new Invoke({
      root: defaultViews
    });
    i.test();
    printLogs();
    expect('').toHaveBeenWarned();
    clear();
  });

  it('both have nested and single route', () => {
    make('index.vue');
    make('temp/index.vue');
    make('temp/temp.vue');
    const i = new Invoke({
      root: defaultViews
    });
    i.test();
    printLogs();
    expect('').toHaveBeenWarned();
    clear();
  });

  it('wrong yaml', () => {
    make('index.vue');
    make('temp/index.vue');
    fs.outputFileSync(
      path.resolve(process.cwd(), 'tests/views/temp/route.yml'),
      `
-qwe-qwe
  a: 1
`
    );
    const i = new Invoke({
      root: defaultViews
    });
    i.test();
    printLogs();
    expect('').toHaveBeenWarned();
    clear();
  });
});

describe('route', () => {
  beforeEach(() => {
    make('index.vue');
  });

  afterEach(() => {
    clear();
  });

  it('single route', () => {
    make('temp/index.vue');
    const i = new Invoke({
      root: defaultViews
    });
    i.test();
    expect(/name: 'temp'/).toHaveBeenMatched();
    expect(/path: '\/temp'/).toHaveBeenMatched();
  });

  it('dynamic route', () => {
    make('_temp/index.vue');
    const i = new Invoke({
      root: defaultViews
    });
    i.test();
    expect(/name: 'temp'/).toHaveBeenMatched();
    expect(/path: '\/:temp'/).toHaveBeenMatched();
  });

  it('nested route', () => {
    make('temp/temp.vue');
    make('temp/inner/index.vue');
    make('temp/inner/_dynamic/index.vue');
    const i = new Invoke({
      root: defaultViews
    });
    i.test();
    expect(/name: 'temp'/).toHaveBeenMatched();
    expect(/path: '\/temp'/).toHaveBeenMatched();
    expect(/path: 'inner'/).toHaveBeenMatched();
    expect(/path: 'inner\/:dynamic'/).toHaveBeenMatched();
  });

  it('nested and dynamic route', () => {
    make('_temp/_temp.vue');
    const i = new Invoke({
      root: defaultViews
    });
    i.test();
    expect(/name: 'temp'/).toHaveBeenMatched();
    expect(/path: '\/:temp'/).toHaveBeenMatched();
    expect(/children: \[\]/).toHaveBeenMatched();
  });

  it('no route', () => {
    make('temp/test.vue');
    const i = new Invoke({
      root: defaultViews
    });
    i.test();
    expect(/name: 'test'/).not.toHaveBeenMatched();
  });

  it('many files in single route', () => {
    make('temp/index.vue');
    make('temp/index.scss');
    make('temp/test.vue');
    const i = new Invoke({
      root: defaultViews
    });
    i.test();
    expect(/name: 'temp'/).toHaveBeenMatched();
    expect(/path: '\/temp'/).toHaveBeenMatched();
  });

  it('many files in nested route', () => {
    make('temp/temp.vue');
    make('temp/index.scss');
    make('temp/test.vue');
    const i = new Invoke({
      root: defaultViews
    });
    i.test();
    expect(/name: 'temp'/).toHaveBeenMatched();
    expect(/path: '\/temp'/).toHaveBeenMatched();
  });

  it('multiple nested route', () => {
    make('temp/temp.vue');
    make('temp/inner/inner.vue');
    const i = new Invoke({
      root: defaultViews
    });
    i.test();
    expect(/path: 'inner'/).toHaveBeenMatched();
  });

  it('multiple dynamic nested route', () => {
    make('_temp/_temp.vue');
    make('_temp/_inner/_inner.vue');
    const i = new Invoke({
      root: defaultViews
    });
    i.test();
    expect(/path: ':inner'/).toHaveBeenMatched();
  });

  it('yaml', () => {
    make('temp/index.vue');
    fs.outputFileSync(
      path.resolve(process.cwd(), 'tests/views/temp/route.yml'),
      `
meta:
  a: 1
`
    );
    const i = new Invoke({
      root: defaultViews
    });
    i.test();
    expect(/"a": 1/).toHaveBeenMatched();
  });
});
