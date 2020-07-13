const fs = require('fs-extra');
const path = require('path');
fs.outputFileSync(
  path.resolve(process.cwd(), 'dist/index.d.ts'),
  `
import { Invoke } from './invoke';
// @ts-ignore
export = Invoke;
export default Invoke;
`
);
