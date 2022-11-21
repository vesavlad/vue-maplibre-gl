import { createCommentVNode, defineComponent, inject, PropType, provide } from 'vue';
import { componentIdSymbol, emitterSymbol, isLoadedSymbol, mapSymbol, sourceIdSymbol, sourceLayerRegistry } from '@/components/types';
import { RasterDEMSourceSpecification, RasterDEMTileSource } from 'maplibre-gl';
import { bindSource, getSourceRef } from '@/components/sources/shared';
import { SourceLayerRegistry } from '@/components/sources/sourceLayer.registry';

const sourceOpts: Array<keyof RasterDEMSourceSpecification> = ['url', 'tiles', 'bounds', 'minzoom', 'maxzoom', 'tileSize', 'attribution', 'encoding'];

export default defineComponent({
	name: 'MglRasterDemSource',
	props: {
		sourceId: {
			type: String as PropType<string>,
			required: true,
		},
		url: String as PropType<string>,
		tiles: Array as PropType<string[]>,
		bounds: Array as PropType<number[]>,
		minzoom: Number as PropType<number>,
		maxzoom: Number as PropType<number>,
		tileSize: Number as PropType<number>,
		attribution: String as PropType<string>,
		encoding: String as PropType<'terrarium' | 'mapbox'>,
	},
	setup(props) {
		const map = inject(mapSymbol)!,
			isLoaded = inject(isLoadedSymbol)!,
			emitter = inject(emitterSymbol)!,
			cid = inject(componentIdSymbol)!,
			source = getSourceRef<RasterDEMTileSource>(cid, props.sourceId),
			registry = new SourceLayerRegistry();

		provide(sourceIdSymbol, props.sourceId);
		provide(sourceLayerRegistry, registry);

		bindSource(map, source, isLoaded, emitter, props, 'raster-dem', sourceOpts, registry);

		return { source };
	},
	render() {
		return [createCommentVNode('Raster DEM Source'), this.source && this.$slots.default ? this.$slots.default() : undefined];
	},
});
