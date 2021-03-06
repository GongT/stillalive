import typescript from 'rollup-plugin-typescript2';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';

const OPWD = process.cwd();

process.chdir(resolve(__dirname, '..'));

const pkg = require(resolve('package.json'));
const tsconfig = resolve('src/tsconfig.json');

const external = [
	pkg.name,
	...Object.keys(pkg.dependencies || {}),
	...Object.keys(pkg.devDependencies || {}),
	'os',
	'stream',
	'util',
];

const watch = {
	chokidar: true,
	include: 'src/**',
};

const plugins = [
	nodeResolve(),
	typescript({tsconfig}),
	commonjs(),
];

const mainFile = pkg.main || resolve('dist/main.js');
const moduleFile = pkg.module || resolve('dist/main.module.js');

const banner = readFileSync(resolve('build/loader.js'), 'utf8');

const commonOutput = {
	intro: banner,
	sourcemap: true,
	name: pkg.name.replace(/^@/, '').replace(/\//g, '__'),
};

const input = existsSync(resolve('src/_export_all_in_once_index.ts'))? resolve('src/_export_all_in_once_index.ts') : resolve('src/index.ts');

const config = [
	{
		input, plugins, external, watch,
		output: [
			{file: mainFile, format: 'cjs', ...commonOutput},
			{file: moduleFile, format: 'esm', ...commonOutput},
		],
	},
];

process.chdir(OPWD);
export default config;
