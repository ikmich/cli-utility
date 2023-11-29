import { fileURLToPath } from 'node:url';
import Path from 'path';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const srcRoot = Path.dirname(__filename);
export const PROJECT_ROOT = Path.dirname(srcRoot);
export const APP_NAME = 'cli-utility';
export const APP_DESCRIPTION = 'Utility for building cli apps';

export { fs };
