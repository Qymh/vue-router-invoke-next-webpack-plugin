import _fs from 'fs';

export function toRawObject(val: any) {
  return Object.prototype.toString.call(val).slice(8, -1);
}

export function isPlainObject(val: any): val is object {
  return toRawObject(val) === 'Object';
}

export function isRegExp(val: any): val is RegExp {
  return toRawObject(val) === 'RegExp';
}

export function isVue(str: string) {
  return /\.vue$/i.test(str);
}

export function isJsOrTs(str: string) {
  return /\.[j|t]sx?/.test(str);
}

export function isYAML(str: string) {
  return /route\.yml$/i.test(str);
}

export function isDir(path: string) {
  return _fs.statSync(path).isDirectory();
}

export function isFile(path: string) {
  return _fs.statSync(path).isFile();
}

export function replacePostfix(path: string) {
  return path.replace(/\.[a-zA-Z]*$/, '');
}

export function camelize(path: string) {
  return path.replace(/(?:[-])(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : c;
  });
}
