import { InjectionKey, Ref, ShallowRef } from 'vue';
import { Map } from 'maplibre-gl';
import { MglMap } from '@/components/index';
import { Emitter } from 'mitt';
import { SourceLayerRegistry } from '@/components/sources/sourceLayer.registry';

export const mapSymbol: InjectionKey<ShallowRef<Map>> = Symbol('map'),
	isLoadedSymbol: InjectionKey<Ref<boolean>> = Symbol('isLoaded'),
	componentIdSymbol: InjectionKey<number> = Symbol('componentId'),
	sourceIdSymbol: InjectionKey<string> = Symbol('sourceId'),
	sourceLayerRegistry: InjectionKey<SourceLayerRegistry> = Symbol('sourceLayerRegistry'),
	emitterSymbol: InjectionKey<Emitter<MglEvents>> = Symbol('emitter');

export interface MglEvent<T = any> {
	type: string;
	component: InstanceType<typeof MglMap>;
	map: Map;
	event: T;
}

export type MglEvents = {
	styleSwitched: StyleSwitchItem;
};

export interface StyleSwitchItem {
	name: string;
	label: string;
	icon?: {
		path: string;
	};
	// StyleSpecification | string
	style: string | any | null;
}
