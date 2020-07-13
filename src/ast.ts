import fs from 'fs-extra';
import {
  isDir,
  isFile,
  isVue,
  isYAML,
  replacePostfix,
  isJsOrTs,
  isPlainObject
} from './utils';
import { Options } from './invoke';
import { error, ErrorCodes } from './error';
import yaml from 'js-yaml';

type RootTree = {
  path: string;
  filePath: string;
  aliasPath: string;
  name: string;
  defaultPage: string;
  children: Tree[];
  routeType: RouteTypes;
  nestPath?: string;
};

type Route = {
  meta?: Record<string, any>;
  redirect?: string;
};

export interface Tree extends RootTree {
  parent?: Tree;
  route: Route;
}

/* eslint-disable no-unused-vars */
export const enum RouteTypes {
  SIMPLE_SINGLE = 1,
  DYNAMIC_SINGLE = 1 << 2,

  SIMPLE_NEST = 1 << 3,
  DYNAMIC_NEST = 1 << 4,

  SINGLE = SIMPLE_SINGLE | DYNAMIC_SINGLE,
  NEST = SIMPLE_NEST | DYNAMIC_NEST,
  DYNAMIC = DYNAMIC_SINGLE | DYNAMIC_NEST,
  UNKNOWN = 1 << 4
}
/* eslint-enable no-unused-vars */

function createTree(name: string = '', path: string = '', type?: RouteTypes) {
  const tree: Tree = {
    // route name
    name,
    // route path
    path,
    // meta
    route: {},
    // absolute path
    filePath: '',
    // relative path
    aliasPath: '',
    children: [],
    // type
    routeType: type === undefined ? RouteTypes.UNKNOWN : type,
    // default file
    defaultPage: ''
  };
  return tree;
}

/**
 * get directory's last name
 * /test/index > index
 * /test/test > test
 *
 * @param directory
 */
function getLastName(directory: string) {
  return /\/([^/]+)$/.exec(directory)![1].toLowerCase();
}

/**
 * get default matching route's fileName
 *
 * example 1
 * dir
 *   - test
 *     - index
 * return index
 *
 * example 2
 * dir
 *   - test
 *     - test
 *
 * return test
 * @param directory
 */
function getDefaultPage(directory: string): string {
  // can not name directory as index or route
  if (/(index|route)$/i.test(directory)) {
    error(
      ErrorCodes.INVALID_ROUTE_RULE,
      `directory naming can not be index or route in ${directory}`
    );
    return '';
  }
  const lastName = getLastName(directory);
  const validFiles = fs.readdirSync(directory).filter((v) => isValidFile(v));
  const validFilesName = validFiles.map((v) => replacePostfix(v).toLowerCase());
  // no match route
  if (validFilesName.length === 0) {
    return '';
  }
  // match route only pick signle route or nested route
  else if (validFilesName.length === 1) {
    if (validFilesName[0] === 'index' || validFilesName[0] === lastName) {
      return validFiles[0];
    } else {
      return '';
    }
  }
  // not only has files match rules of generating routes
  else if (validFilesName.length >= 2) {
    if (validFilesName.includes('index') && validFilesName.includes(lastName)) {
      // wrong both have signle route and nested route
      error(
        ErrorCodes.INVALID_ROUTE_RULE,
        `the directory ${directory} has both signle route and nested route which are ${validFiles.join(
          ','
        )}`
      );
      return '';
    }
    // single route
    else if (validFilesName.includes('index')) {
      const index = validFilesName.indexOf('index');
      return validFiles[index];
    }
    // nested route
    else if (validFilesName.includes(lastName)) {
      const index = validFilesName.indexOf(lastName);
      return validFiles[index];
    }
  }
  // for ts check
  return '';
}

export function isValidFile(path: string) {
  return isVue(path) || isYAML(path) || isJsOrTs(path);
}

function toDynamicName(path: string) {
  return path.replace(/^_/g, '').replace(/-_/g, '-');
}

function toDynamicPath(path: string) {
  return path.replace(/^_/g, ':').replace(/\/_/g, '/:');
}

function pathToArr(path: string) {
  return path.split('/').filter(Boolean);
}

function pathToName(path: string) {
  return path.split('/').filter(Boolean).join('-');
}

function isDynamicPath(path: string) {
  return /^_.+/.test(path);
}

function checkRouteTypes(path: string, parentPath: string) {
  const pathArr = pathToArr(path);
  const pathArrLast = pathArr[pathArr.length - 1];
  const parentPathArr = pathToArr(parentPath);
  const parentPathArrLast = parentPathArr[parentPathArr.length - 1];
  const simpleType = checkSimpleRouteTypes(pathArrLast, parentPathArrLast);
  if (isDynamicPath(parentPathArrLast)) {
    if (simpleType === RouteTypes.SIMPLE_SINGLE) {
      return RouteTypes.DYNAMIC_SINGLE;
    } else if (simpleType === RouteTypes.SIMPLE_NEST) {
      return RouteTypes.DYNAMIC_NEST;
    }
  }
  return simpleType;
}

function checkSimpleRouteTypes(pathArrLast: string, parentPathArrLast: string) {
  if (pathArrLast === parentPathArrLast) {
    return RouteTypes.SIMPLE_NEST;
  } else if (pathArrLast === 'index') {
    return RouteTypes.SIMPLE_SINGLE;
  }
}

function setTreePath(tree: Tree, filePath: string, options: Options) {
  tree.filePath = filePath;
  tree.aliasPath = filePath
    .replace(options.root, options.alias)
    .replace(/\.[jt]sx?$/, '');
}

function processDirectory(directory: string, options: Options, parent: Tree) {
  const defaultPage = getDefaultPage(directory);
  if (!defaultPage) {
    return;
  }
  const relativePath = options.getRelativePath(directory);
  const tree = createTree(pathToName(relativePath), relativePath);
  tree.parent = parent;
  tree.defaultPage = defaultPage;
  parent.children.push(tree);
  patch(tree, directory, options);
  return tree;
}

function processFile(file: string, options: Options, tree: Tree) {
  if (isValidFile(file) && tree.name !== 'index') {
    const { defaultPage } = tree;
    const baseName = getLastName(file);
    if (baseName === defaultPage.toLowerCase()) {
      processPage(file, options, tree);
    } else if (isYAML(baseName)) {
      processYAML(file, tree);
    }
  }
}

function processYAML(path: string, tree: Tree) {
  const res = fs.readFileSync(path).toString();
  try {
    const route = yaml.safeLoad(res);
    if (isPlainObject(route)) {
      tree.route = route || {};
    }
  } catch (err) {
    tree.route = {};
    error(ErrorCodes.YAML_PARSE_ERROR, err.message);
  }
}

function findParentNestPath(tree: Tree) {
  let vm = tree;
  while (vm.parent) {
    if (vm.parent.routeType & RouteTypes.NEST) {
      return vm.parent.nestPath;
    }
    vm = vm.parent;
  }
}

function processPage(file: string, options: Options, tree: Tree) {
  const { path } = tree;
  const relativePath = options.getRelativePath(file);
  const routeType = checkRouteTypes(relativePath, path)!;
  tree.routeType = routeType;
  const nestPath = findParentNestPath(tree);
  // set base name and base path
  setTreePath(tree, file, options);
  // dynamic route
  if (routeType & RouteTypes.DYNAMIC) {
    if (routeType === RouteTypes.DYNAMIC_NEST) {
      if (nestPath) {
        tree.path = tree.path.replace(nestPath, '').slice(1);
      }
      tree.nestPath = tree.path;
    } else {
      if (nestPath) {
        tree.path = tree.path.replace(nestPath, '').slice(1);
      }
    }
  }

  // nested route
  else if (routeType & RouteTypes.NEST) {
    tree.nestPath = path;
    if (nestPath) {
      tree.path = tree.path.replace(nestPath, '').slice(1);
    }
  }

  // single route
  else {
    if (nestPath) {
      tree.path = tree.path.replace(nestPath, '').slice(1);
    }
  }

  tree.name = toDynamicName(tree.name);
  tree.path = toDynamicPath(tree.path);
}

function sortFileFrontOfDir(pathArr: string[]) {
  return pathArr.sort((a, b) => {
    const fileA = /\.[a-zA-Z]+$/.test(a) ? 1 : -1;
    const fileB = /\.[a-zA-Z]+$/.test(b) ? 1 : -1;
    return fileB - fileA;
  });
}

function patch(tree: Tree, directory: string, options: Options) {
  const files = sortFileFrontOfDir(fs.readdirSync(directory));
  for (const file of files) {
    const absolutePath = `${directory}/${file}`;
    if (isDir(absolutePath)) {
      processDirectory(absolutePath, options, tree);
    } else if (isFile(absolutePath)) {
      processFile(absolutePath, options, tree);
    }
  }
}

export function genAST(options: Options): Tree | never | undefined {
  const { root } = options;
  const defaultPage = getDefaultPage(root);
  if (defaultPage) {
    const rootTree = createTree('index', '/', RouteTypes.SIMPLE_SINGLE);
    setTreePath(rootTree, root + '/' + defaultPage, options);
    rootTree.defaultPage = defaultPage;
    patch(rootTree, root, options);
    return rootTree;
  } else {
    error(
      ErrorCodes.INVALID_ROUTE_RULE,
      `the root directory ${root} must have index.js index.ts index.vue index.jsx or index.tsx for homepage`
    );
    return undefined;
  }
}
