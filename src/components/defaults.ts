import { LngLatLike, MapOptions } from 'maplibre-gl';
import { reactive } from 'vue';

export declare type CustomMapOptions = Omit<MapOptions, 'container'>;
export const defaults: CustomMapOptions = reactive({
	style: 'https://demotiles.maplibre.org/style.json',
	center: Object.freeze([0, 0]) as LngLatLike,
	zoom: 1,
	trackResize: false,
});
