import { createCommentVNode, createTextVNode, defineComponent, h, inject, onBeforeUnmount, PropType, Ref, ref, renderSlot, Teleport, watch } from 'vue';
import { Position, PositionValue, PositionValues, usePositionWatcher } from '@/components/controls/shared';
import { emitterSymbol, isLoadedSymbol, mapSymbol, StyleSwitchItem } from '@/components/types';
import { CustomControl } from '@/components/controls/custom.control';
import { ButtonType, default as MglButton } from '@/components/button.component';

function isEvent(e: any): e is Event {
	return e && !!(e as Event).stopPropagation;
}

export declare type MglStyleSwitchControl = {
	added: Ref<Boolean>;
	container?: HTMLDivElement;
	styleFn: (s: StyleSwitchItem) => void;
	toggleFn: (forceIsOpen?: boolean | Event, e?: Event) => void;
	isOpen: Ref<Boolean>;
	modelValue: any;
};

export default defineComponent({
	name: 'MglStyleSwitchControl',
	props: {
		position: {
			type: String as PropType<PositionValue>,
			validator: (v: Position) => {
				return PositionValues.indexOf(v) !== -1;
			},
		},
		mapStyles: {
			type: Array as PropType<StyleSwitchItem[]>,
			required: true,
			default: [],
		},
		modelValue: {
			type: Object as PropType<StyleSwitchItem>,
		},
		isOpen: {
			type: Boolean as PropType<boolean>,
			default: undefined,
		},
	},
	emits: ['update:modelValue', 'update:isOpen'],
	setup: function (props, ctx) {
		const map = inject(mapSymbol)!,
			isMapLoaded = inject(isLoadedSymbol)!,
			emitter = inject(emitterSymbol)!,
			isAdded = ref(false),
			isOpen = ref(props.isOpen === undefined ? false : props.isOpen),
			modelValue = ref(props.modelValue === undefined ? (props.mapStyles.length ? props.mapStyles[0] : null) : props.modelValue),
			control = new CustomControl(isAdded, false),
			closer = toggleOpen.bind(null, false);

		function setStyleByMap() {
			const name = map.value.getStyle().name;
			for (let i = 0, len = props.mapStyles.length; i < len; i++) {
				if (props.mapStyles[i].name === name) {
					setStyle(props.mapStyles[i]);
					break;
				}
			}
		}

		watch(
			isMapLoaded,
			(v) => {
				if (v) setStyleByMap();
			},
			{ immediate: true }
		);
		map.value.on('style.load', setStyleByMap);
		document.addEventListener('click', closer);

		usePositionWatcher(() => props.position, map, control);

		if (props.modelValue !== undefined) {
			watch(
				() => props.modelValue,
				(v) => {
					if (v !== undefined) modelValue.value = v;
				}
			);
		}
		if (props.isOpen !== undefined) {
			watch(
				() => props.isOpen,
				(v) => {
					if (v !== undefined) isOpen.value = v;
				}
			);
		}

		onBeforeUnmount(() => {
			map.value.removeControl(control);
			map.value.off('style.load', setStyleByMap);
			document.removeEventListener('click', closer);
		});

		function setStyle(s: StyleSwitchItem) {
			if (modelValue.value?.name === s.name) {
				return;
			}
			emitter.emit('styleSwitched', s);
			map.value.setStyle(s.style);
			if (props.modelValue === undefined) {
				modelValue.value = s;
			}
			ctx.emit('update:modelValue', s);

			toggleOpen(false);
		}

		function toggleOpen(forceIsOpen?: boolean | Event, e?: Event) {
			if (isEvent(e)) {
				e.stopPropagation();
			} else if (isEvent(forceIsOpen)) {
				forceIsOpen.stopPropagation();
			}
			if ((props.isOpen !== undefined && props.isOpen === forceIsOpen) || isOpen.value === forceIsOpen) {
				return;
			}
			if (props.isOpen === undefined) {
				isOpen.value = typeof forceIsOpen === 'boolean' ? forceIsOpen : !isOpen.value;
				ctx.emit('update:isOpen', isOpen.value);
			} else {
				ctx.emit('update:isOpen', typeof forceIsOpen === 'boolean' ? forceIsOpen : !props.isOpen);
			}
		}

		const result: MglStyleSwitchControl = { added: isAdded, styleFn: setStyle, toggleFn: toggleOpen, isOpen: isOpen, modelValue: modelValue };
		result.container = control.container;
		result.modelValue = modelValue;

		return result;
	},
	// just only for code assist
	template: `
		<div class="maplibregl-ctrl maplibregl-ctrl-group">
		<slot>
			<slot name="button">
				<button type="button" class="maplibregl-ctrl-icon maplibregl-style-switch"></button>
			</slot>
			<slot name="styleList">
				<div class="maplibregl-style-list" style="display: none;">
					<button type="button" class="Dark" data-uri="&quot;mapbox://styles/mapbox/dark-v10&quot;">Dark</button>
					<button type="button" class="Light" data-uri="&quot;mapbox://styles/mapbox/light-v10&quot;">Light</button>
					<button type="button" class="Outdoors" data-uri="&quot;mapbox://styles/mapbox/outdoors-v11&quot;">Outdoors</button>
					<button type="button" class="Satellite" data-uri="&quot;mapbox://styles/mapbox/satellite-streets-v11&quot;">Satellite</button>
					<button type="button" class="Streets active" data-uri="&quot;mapbox://styles/mapbox/streets-v11&quot;">Streets</button>
				</div>
			</slot>
		</slot>
		</div>
	`,
	render() {
		if (!this.added) {
			return createCommentVNode('style-switch-control');
		}
		const slotProps = {
			isOpen: this.isOpen,
			currentStyle: this.modelValue,
			mapStyles: this.mapStyles,
			toggleOpen: this.toggleFn,
			setStyle: this.styleFn,
		};
		return h(
			Teleport as any,
			{ to: this.container },
			renderSlot(this.$slots, 'default', slotProps, () => [
				renderSlot(this.$slots, 'button', slotProps, () => [
					h(MglButton, {
						type: ButtonType.MDI,
						path: "M12,18.54L19.37,12.8L21,14.07L12,21.07L3,14.07L4.62,12.81L12,18.54M12,16L3,9L12,2L21,9L12,16M12,4.53L6.26,9L12,13.47L17.74,9L12,4.53Z",
						class: ['maplibregl-ctrl-icon maplibregl-style-switch', this.isOpen ? 'is-open' : ''],
						onClick: this.toggleFn.bind(null, true),
					}),
				]),
				renderSlot(this.$slots, 'styleList', slotProps, () => [
					h(
						'div',
						{ class: ['maplibregl-style-list', this.isOpen ? 'is-open' : ''] },
						this.mapStyles.map((s) => {
							return s.icon
								? h(
										MglButton,
										{
											type: ButtonType.MDI,
											path: s.icon.path,
											class: this.modelValue?.name === s.name ? 'is-active' : '',
											onClick: () => this.styleFn(s),
										},
										createTextVNode(s.label)
								  )
								: h(
										'button',
										{
											type: 'button',
											class: this.modelValue?.name === s.name ? 'is-active' : '',
											onClick: () => this.styleFn(s),
										},
										createTextVNode(s.label)
								  );
						})
					),
				]),
			])
		);
	},
});
