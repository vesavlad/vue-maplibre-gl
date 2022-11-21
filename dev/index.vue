<template>
	<div class='root'>
		<label for='selector'>Select demo</label>
		<select class='selector' v-model='option'>
			<option>geojson</option>
			<option>vector</option>
		</select>
		<vector-sample v-if='option === "vector"'></vector-sample>
		<geojson-sample v-if='option === "geojson"'></geojson-sample>
	</div>
</template>

<script>
import VectorSample from './vector.vue';
import GeojsonSample from './geojson.vue';
import { ref } from 'vue';
export default {
	name: 'root.vue',
	components: { VectorSample, GeojsonSample },
	setup() {
		const option = ref('vector');
		return {
			option
		}
	}
};
</script>

<style scoped>
.root {

}
.selector {
	height: 30px;
	margin: 10px;
	horiz-align: center;
}
</style>
