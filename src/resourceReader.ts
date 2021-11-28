import * as fs from 'fs';
import * as path from 'path';

let resourcePath;

export function setResourcePath(p: string) {
  resourcePath = p;
}

export function readBootTidal() {
  const bootTidalPath = path.join(resourcePath, 'BootTidal.hs');
  const data = fs.readFileSync(bootTidalPath, 'utf8');
  return data;
}
