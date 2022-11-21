import { createApp } from 'vue';
// import geojson from './geojson.vue';
import index from './index.vue';
// To register individual components where they are used (geojson.vue) instead of using the
// library as a whole, comment/remove this import and it's corresponding "app.use" call
import lib from '@/entry';

const app = createApp(index);
app.use(lib);

app.mount('#app');
