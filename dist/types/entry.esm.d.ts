import type { Plugin } from 'vue';
declare const install: Exclude<Plugin['install'], undefined>;
export default install;
export * from './components/index';
export * from './components/types';
export { useMap } from './components/mapRegistry';
export { defaults as MglDefaults } from './components/defaults';
export { usePositionWatcher, Position } from './components/controls/shared';
