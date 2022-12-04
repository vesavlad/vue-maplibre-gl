<template>
	<div>
		<div style="height: 400px; width: 800px">
			<mgl-map
				v-if="showMap"
				ref="map"
				style="margin-bottom: 20px"
				:center="center"
				:zoom="zoom"
				:attribution-control="false"
				@map:load="onLoad"
				@map:zoomstart="isZooming = true"
				@map:zoomend="isZooming = false"
			>
				<mgl-frame-rate-control />
				<mgl-fullscreen-control />
				<mgl-attribution-control />
				<mgl-navigation-control />
				<mgl-scale-control />
				<mgl-geolocation-control />
				<mgl-custom-control v-if="showCustomControl" position="top-left" :no-classes="!useClasses">
					<mgl-button type="mdi" :path="buttonIcon" style="color: deepskyblue" />
				</mgl-custom-control>
				<mgl-style-switch-control :map-styles="mapStyles" :position="controlPosition" />

				<mgl-marker :coordinates="markerCoordinates" color="#cc0000" :scale="0.5" />

				<mgl-vector-source source-id="bike-stops-source" :tiles="['https://api.opentransport.ro/map/v1/romania-citybike-map/{z}/{x}/{y}.pbf']">
					<mgl-symbol-layer layer-id="bike-stops-layer" source-layer="stations" :layout="bikeLayout"> </mgl-symbol-layer>
				</mgl-vector-source>

				<mgl-vector-source source-id="transit-stops-source" :tiles="['https://api.opentransport.ro/map/v1/romania-stop-map/{z}/{x}/{y}.pbf']">
					<mgl-symbol-layer layer-id="transit-stops-layer" source-layer="stops" :layout="transitLayout"> </mgl-symbol-layer>
				</mgl-vector-source>
			</mgl-map>
		</div>
		Loaded Count: {{ loaded }}<br />
		Is Zooming: {{ isZooming }}<br />
		<div>
			<input type="radio" id="one" value="top-left" v-model="controlPosition" />
			<label for="one">top-left</label>
			<br />
			<input type="radio" id="tw0" value="top-right" v-model="controlPosition" />
			<label for="tw0">top-right</label>
			<br />
			<input type="radio" id="three" value="bottom-left" v-model="controlPosition" />
			<label for="three">bottom-left</label>
			<br />
			<input type="radio" id="four" value="bottom-right" v-model="controlPosition" />
			<label for="four">bottom-right</label>
			<br />
			<span>Attribution Position: {{ controlPosition }}</span>
		</div>
		<div>
			<input type="checkbox" v-model="useClasses" id="noclasses" />
			<label for="noclasses">Use Custom Control Classes</label>
		</div>
		<div>
			<input type="checkbox" v-model="showCustomControl" id="showcustom" />
			<label for="showcustom">Show Custom Control</label>
		</div>
		<div>
			<input type="checkbox" v-model="showMap" id="showmap" />
			<label for="showmap">Show Map</label>
		</div>
	</div>
</template>

<script lang="ts">
import { MglDefaults, MglEvent, StyleSwitchItem, useMap } from '@/entry';
import { defineComponent, ref, toRef, watch } from 'vue';
import { SymbolLayout } from '@/components/layers/symbol.layer';

MglDefaults.style = 'https://api.maptiler.com/maps/streets/style.json?key=cQX2iET1gmOW38bedbUh';

export default defineComponent({
	name: 'vector-sample',
	setup() {
		const map = useMap(),
			showCustomControl = ref(true);

		watch(toRef(map, 'isLoaded'), () => console.log('IS LOADED', map), { immediate: true });
		watch(toRef(map, 'isMounted'), (v) => console.log('IS MOUNTED', v), { immediate: true });

		return {
			showCustomControl,
			loaded: ref(0),
			isZooming: false,
			controlPosition: ref('top-left'),
			showMap: ref(true),
			center: [10.288107, 49.405078],
			zoom: 3,
			useClasses: true,
			mapStyles: [
				{
					name: 'Streets',
					label: 'Streets',
					// icon : { path: mdiRoad },
					style: 'https://api.maptiler.com/maps/streets/style.json?key=cQX2iET1gmOW38bedbUh',
				},
				{
					name: 'Basic',
					label: 'Basic',
					style: 'https://api.maptiler.com/maps/basic/style.json?key=cQX2iET1gmOW38bedbUh',
				},
				{
					name: 'Bright',
					label: 'Bright',
					style: 'https://api.maptiler.com/maps/bright/style.json?key=cQX2iET1gmOW38bedbUh',
				},
				{
					name: 'Satellite',
					label: 'Satellite',
					style: 'https://api.maptiler.com/maps/hybrid/style.json?key=cQX2iET1gmOW38bedbUh',
				},
				{
					name: 'Voyager',
					label: 'Voyager',
					style: 'https://api.maptiler.com/maps/voyager/style.json?key=cQX2iET1gmOW38bedbUh',
				},
			] as StyleSwitchItem[],
			bikeLayout: {
				'icon-size': 0.125,
				'icon-anchor': 'center',
				'icon-image': 'transit-bike',
				'symbol-sort-key': 10,
			} as SymbolLayout,
			transitLayout: {
				// This is called "data-driven style"
				// Check out https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/
				'icon-size': 0.125,
				'symbol-sort-key': [
					'step',
					['zoom'],
					// Far-away, zoomed-out level
					['case', ['in', 'SUBWAY', ['get', 'type']], 50, ['in', 'RAIL', ['get', 'type']], 110, ['in', 'TRAM', ['get', 'type']], 70, 100],
					// Nearby zoomed-in level
					10,
					['case', ['in', 'SUBWAY', ['get', 'type']], 50, ['in', 'RAIL', ['get', 'type']], 60, ['in', 'TRAM', ['get', 'type']], 70, 100],
				],
				'icon-anchor': 'center',
				'icon-offset': [20.0, -20.0],
				'icon-image': ['concat', 'transit-', ['downcase', ['case', ['in', ['literal', ','], ['get', 'type']], 'mixed', ['get', 'type']]]],
			} as SymbolLayout,
			buttonIcon:
				'M10.76,8.69A0.76,0.76 0 0,0 10,9.45V20.9C10,21.32 10.34,21.66 10.76,21.66C10.95,21.66 11.11,21.6 11.24,21.5L13.15,19.95L14.81,23.57C14.94,23.84 15.21,24 15.5,24C15.61,24 15.72,24 15.83,23.92L18.59,22.64C18.97,22.46 19.15,22 18.95,21.63L17.28,18L19.69,17.55C19.85,17.5 20,17.43 20.12,17.29C20.39,16.97 20.35,16.5 20,16.21L11.26,8.86L11.25,8.87C11.12,8.76 10.95,8.69 10.76,8.69M15,10V8H20V10H15M13.83,4.76L16.66,1.93L18.07,3.34L15.24,6.17L13.83,4.76M10,0H12V5H10V0M3.93,14.66L6.76,11.83L8.17,13.24L5.34,16.07L3.93,14.66M3.93,3.34L5.34,1.93L8.17,4.76L6.76,6.17L3.93,3.34M7,10H2V8H7V10',
			markerCoordinates: [13.377507, 52.516267],
		};
	},
	methods: {
		onLoad(e: MglEvent) {
			const pinImages = [
				{ slug: 'transit-bike', url: '/dev/assets/icons-transit/bike.png' },

				{ slug: 'transit-subway', url: '/dev/assets/icons-transit/metro.png' },
				{ slug: 'transit-metro', url: '/dev/assets/icons-transit/metro-stop.png' },
				{ slug: 'transit-bus', url: '/dev/assets/icons-transit/bus-stop.png' },
				{ slug: 'transit-school_bus', url: '/dev/assets/icons-transit/bus-special.png' },
				{ slug: 'transit-rail', url: '/dev/assets/icons-transit/train.png' },
				{ slug: 'transit-tram', url: '/dev/assets/icons-transit/tram.png' },
				{ slug: 'transit-trolley_bus', url: '/dev/assets/icons-transit/trolley.png' },
				{ slug: 'transit-mixed', url: '/dev/assets/icons-transit/mixed-stop.png' },

				{ slug: 'transit-unknown', url: '/dev/assets/icons-pins/error.png' },

				// Unused:
				// {slug: 'transit-scooter', url: '/dev/assets/icons-transit/scooter.png'},
			];
			this.loaded++;
			const { map } = e;
			for (const { slug, url } of pinImages) {
				if (!map.hasImage(slug)) {
					map.loadImage(url, (error, image) => {
						if (error) {
							console.log(error, url);
						}
						if (image && !map.hasImage(slug)) {
							map.addImage(slug, image, { sdf: false });
						}
					});
				}
			}
		},
	},
	mounted() {
		setTimeout(() => (this.markerCoordinates = [13.377507, 42.516267]), 5000);
	},
});
</script>

<style lang="scss">
@import '@/css/maplibre';

body {
	margin: 0;
}
</style>
