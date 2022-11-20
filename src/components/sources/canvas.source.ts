import { createCommentVNode, defineComponent, inject, PropType, provide, watch } from 'vue';
import { componentIdSymbol, emitterSymbol, isLoadedSymbol, mapSymbol, sourceIdSymbol, sourceLayerRegistry } from '@/components/types';
import { CanvasSource, CanvasSourceSpecification, Coordinates } from 'maplibre-gl';
import { bindSource, getSourceRef } from '@/components/sources/shared';
import { SourceLayerRegistry } from '@/components/sources/sourceLayer.registry';

const sourceOpts: Array<keyof CanvasSourceSpecification> = ['animate', 'coordinates', 'canvas'];

export default defineComponent({
	name: 'MglCanvasSource',
	props: {
		sourceId: {
			type: String as PropType<string>,
			required: true,
		},
		coordinates: Object as PropType<Coordinates>,
		animate: Boolean as PropType<boolean>,
		canvas: [HTMLCanvasElement, String] as PropType<HTMLCanvasElement | string>,
	},
	setup(props) {
		const map = inject(mapSymbol)!,
			isLoaded = inject(isLoadedSymbol)!,
			emitter = inject(emitterSymbol)!,
			cid = inject(componentIdSymbol)!,
			source = getSourceRef<CanvasSource>(cid, props.sourceId),
			registry = new SourceLayerRegistry();

		provide(sourceIdSymbol, props.sourceId);
		provide(sourceLayerRegistry, registry);

		bindSource(map, source, isLoaded, emitter, props, 'canvas', sourceOpts, registry);
		watch(
			() => props.coordinates,
			(v) => source.value?.setCoordinates(v || ({} as Coordinates))
		);

		return { source };
	},
	render() {
		return [createCommentVNode('Canvas Source'), this.source && this.$slots.default ? this.$slots.default() : undefined];
	},
});
