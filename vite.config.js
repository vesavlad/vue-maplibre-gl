// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import pkg from './package.json';

export const banner = `/*!
* ${pkg.name} v${pkg.version}
* (c) ${new Date().getFullYear()} ${pkg.author.name}
* @license ${pkg.license}
*/`;

/** @type {import('vite').UserConfig} */
export default defineConfig({
	plugins: [vue(), dts({ outputDir: 'dist/types' })],
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},

	build: {
		lib: {
			entry: resolve(__dirname, 'src/entry.ts'),
			name: 'VueMaplibreGl',
			fileName: (format) => {
				let desc = { cjs: 'ssr', es: 'esm', umd: 'min' }[format] || format;
				return 'vue-maplibre-gl.' + desc + '.js';
			},
		},
		rollupOptions: {
			external: ['vue', 'maplibre-gl'],
			output: [
				{
					format: 'cjs',
					exports: 'named',
					strict: true,
					banner: banner,
				},
				{
					format: 'es',
					exports: 'named',
					sourcemap: true,
					banner: banner,
				},
				{
					format: 'umd',
					exports: 'named',
					banner: banner,
					sourcemap: true,
					globals: {
						vue: 'vue',
						mitt: 'mitt',
						'maplibre-gl': 'maplibregl',
					},
				},
			],
		},
	},
});
