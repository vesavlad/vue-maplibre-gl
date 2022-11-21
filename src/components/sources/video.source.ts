import { createCommentVNode, defineComponent, inject, PropType, provide, watch } from 'vue';
import { componentIdSymbol, emitterSymbol, isLoadedSymbol, mapSymbol, sourceIdSymbol, sourceLayerRegistry } from '@/components/types';
import { Coordinates, VideoSource, VideoSourceSpecification } from 'maplibre-gl';
import { bindSource, getSourceRef } from '@/components/sources/shared';
import { SourceLayerRegistry } from '@/components/sources/sourceLayer.registry';

const sourceOpts: Array<keyof VideoSourceSpecification> = ['urls', 'coordinates'];

export default defineComponent({
	name: 'MglVideoSource',
	props: {
		sourceId: {
			type: String as PropType<string>,
			required: true,
		},
		urls: Array as PropType<string[]>,
		coordinates: Object as PropType<Coordinates>,
	},
	setup(props) {
		const map = inject(mapSymbol)!,
			isLoaded = inject(isLoadedSymbol)!,
			emitter = inject(emitterSymbol)!,
			cid = inject(componentIdSymbol)!,
			source = getSourceRef<VideoSource>(cid, props.sourceId),
			registry = new SourceLayerRegistry();

		provide(sourceIdSymbol, props.sourceId);
		provide(sourceLayerRegistry, registry);

		bindSource(map, source, isLoaded, emitter, props, 'video', sourceOpts, registry);
		watch(
			() => props.coordinates,
			(v) => source.value?.setCoordinates(v || ({} as Coordinates))
		);

		return { source };
	},
	render() {
		return [createCommentVNode('Video Source'), this.source && this.$slots.default ? this.$slots.default() : undefined];
	},
});
