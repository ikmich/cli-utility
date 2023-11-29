import shell from 'shelljs';
import { log, logError, logNotice, logSuccess } from '../../lib/log.js';
import { fs } from '../../common.js';
import Path from 'path';
import { _fn, toJson } from '../../util.js';
import { binFileContents } from './bin-file.contents.js';
import { storeFileContents } from './store-file.contents.js';
import { tsconfigFileContents } from './tsconfig-file.contents.js';
import { utilFileContents } from './util-file.contents.js';
import { commonFileContents } from './common-file.contents.js';

export type ProjectGeneratorOpts = {
  projectRoot: string;
  projectName: string;
};
export const projectGenerator = {
  generate(opts: ProjectGeneratorOpts) {
    const { projectName, projectRoot } = opts;

    fs.ensureDirSync(projectRoot);

    const packageJsonFile = Path.join(projectRoot, 'package.json');
    const hasPackageJson = () => fs.existsSync(packageJsonFile);

    // npm init
    _fn(() => {
      if (hasPackageJson()) return;
      logNotice('Initializing project...');
      const output = shell.exec(`npm init -y`, { cwd: projectRoot, silent: true });
      if (output.stderr) {
        logError(output.stderr);
      }
    });

    if (
      !_fn(() => {
        logNotice('Setting up typescript...');
        const { stderr, stdout } = shell.exec('npx tsc --init', { cwd: projectRoot, silent: true });
        if (stderr) {
          logError(stderr);
        }

        const tsconfigFile = Path.join(projectRoot, 'tsconfig.json');
        if (!fs.existsSync(tsconfigFile)) {
          logError('tsconfig.json not found');
          return false;
        }

        fs.writeFileSync(tsconfigFile, tsconfigFileContents.build());
        return true;
      })
    ) {
      return;
    }

    // package.json
    _fn(() => {
      if (!hasPackageJson) {
        logError('package.json file not found');
        return;
      }

      const pkgJsonObj = fs.readJsonSync(packageJsonFile);
      pkgJsonObj['name'] = projectName;
      pkgJsonObj['type'] = 'module';
      pkgJsonObj['main'] = './dist/bin.js';
      pkgJsonObj['scripts'] = {
        ...pkgJsonObj['scripts'],
        clean: 'rimraf dist/',
        build: 'tsc',
        check: 'tsc --noEmit',
        prepublishOnly: 'npm run build'
      };
      pkgJsonObj['bin'] = {
        [projectName]: `./dist/bin.js`
      };
      pkgJsonObj['engines'] = {
        node: '>=16'
      };
      pkgJsonObj['files'] = ['dist/', 'LICENSE', 'package.json', 'README.md'];

      fs.writeFileSync(packageJsonFile, toJson(pkgJsonObj), { encoding: 'utf-8' });
    });

    logNotice('Preparing dependencies');

    // typescript dependencies
    _fn(() => {
      const tsDependencies = ['typescript', 'tsx'];
      const { stderr } = shell.exec(`npm install -D ${tsDependencies.join(' ')}`, {
        cwd: projectRoot
      });
      if (stderr) {
        logError(stderr);
      }
    });

    // dev dependencies
    _fn(() => {
      const devDependencies = ['prettier', '@types/node', 'rimraf'];
      const { stderr } = shell.exec(`npm install --package-lock-only -D ${devDependencies.join(' ')}`, {
        cwd: projectRoot
      });
      if (stderr) {
        logError(stderr);
      }
    });

    _fn(() => {
      const runtimeDependencies = ['cli-utility'];
      const { stderr } = shell.exec(`npm install --package-lock-only ${runtimeDependencies.join(' ')}`, {
        cwd: projectRoot,
        silent: true
      });
      if (stderr) {
        logError(stderr);
      }
    });

    // [src/]
    const srcRoot = Path.join(projectRoot, 'src');
    fs.ensureDirSync(srcRoot);

    // [bin.ts]
    _fn(() => {
      const binFile = Path.join(srcRoot, 'bin.ts');
      const contents = binFileContents.build({
        appName: projectName,
        description: 'My cli project'
      });
      fs.writeFileSync(binFile, contents, { encoding: 'utf-8' });
    });

    // [data-store.ts]
    _fn(() => {
      const storeFile = Path.join(srcRoot, 'data-store.ts');
      const contents = storeFileContents.build(projectName);
      fs.writeFileSync(storeFile, contents, { encoding: 'utf-8' });
    });

    // [common file]
    _fn(() => {
      const commonFile = Path.join(srcRoot, 'common.ts');
      fs.writeFileSync(commonFile, commonFileContents.build(projectName), { encoding: 'utf-8' });
    });

    // [util file]
    _fn(() => {
      const utilFile = Path.join(srcRoot, 'utils.ts');
      fs.writeFileSync(utilFile, utilFileContents.build(), { encoding: 'utf-8' });
    });

    logSuccess('Done!');
    log('-> Run "npm install" in the project.');
  }
};
