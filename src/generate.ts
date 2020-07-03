import { Options } from './invoke';
import { genAST, Tree, RouteTypes } from './ast';
import beautify from 'js-beautify';
import { watchFiles, outputFile } from './file';
import { success } from './error';

type PushBuffer = (str: string) => void;

function createBuffer(options: Options) {
  function genVue3Buffer() {
    push(`
      import { createRouter, ${
        mode === 'history' ? 'createWebHistory' : 'createWebHashHistory'
      } } from 'vue-router';

      export const routerHistory = ${
        mode === 'history' ? 'createWebHistory()' : 'createWebHashHistory()'
      };
      export const router = createRouter({
        history: routerHistory,
    `);
  }

  function genVue2Buffer() {
    push(`
      import Vue from 'vue';
      import Router from 'vue-router';

      Vue.use(Router)
      export const router = new Router({
        history: '${mode}',
    `);
  }

  let buffer: string = '';
  const { mode, version } = options;
  function push(str: string) {
    buffer += str;
  }

  +version === 2 ? genVue2Buffer() : genVue3Buffer();

  return {
    push,
    get() {
      return beautify.js(buffer, {
        indent_size: 2,
        space_in_empty_paren: true
      });
    }
  };
}

function genRoutesBuffer(push: PushBuffer, ast: Tree) {
  push(`
    routes: [
  `);
  genRouteBuffer(push, ast);
  push('],');
}

function genRouteBuffer(push: PushBuffer, ast: Tree) {
  const { name, path, route, aliasPath, routeType } = ast;
  const { meta, redirect } = route;
  push(`
    {
      name: '${name}',
      path: '${path}',
      component: () => import ('${aliasPath}'),
  `);
  if (meta) {
    push(`
      meta: ${JSON.stringify(meta)},
    `);
  }
  if (redirect) {
    push(`
      redirect: '${redirect}',
    `);
  }
  if (routeType & RouteTypes.SINGLE) {
    push('},');
    genRouteChildrenBuffer(push, ast.children);
  } else if (routeType & RouteTypes.NEST) {
    push(`
      children:[
    `);
    genRouteChildrenBuffer(push, ast.children);
    push('],},');
  }
}

function genRouteOptionsBuffer(push: PushBuffer, options: Options) {
  const { scrollBehavior } = options;
  if (scrollBehavior) {
    push(`
      scrollBehavior: function ${scrollBehavior.toString()},
    `);
  }
}

function genRouteChildrenBuffer(push: PushBuffer, children: Tree[]) {
  for (const child of children) {
    genRouteBuffer(push, child);
  }
}
export function generate(options: Options) {
  const { dist, language } = options;
  const generatedFn = () => {
    const ast = genAST(options);
    // console.dir(ast, { depth: null });
    if (ast) {
      const { push, get } = createBuffer(options);
      genRoutesBuffer(push, ast);
      genRouteOptionsBuffer(push, options);
      push('});');
      const output = `${dist}/router.${
        language === 'javascript' ? 'js' : 'ts'
      }`;
      outputFile(output, get());
      success(output);
    }
  };
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development') {
    watchFiles(options, generatedFn);
  } else {
    generatedFn();
  }
}
