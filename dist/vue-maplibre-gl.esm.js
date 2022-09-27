var Be = Object.defineProperty;
var Ee = (e, t, o) => t in e ? Be(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[t] = o;
var O = (e, t, o) => (Ee(e, typeof t != "symbol" ? t + "" : t, o), o);
import { reactive as te, watch as h, defineComponent as f, markRaw as oe, getCurrentInstance as _, shallowRef as Q, ref as H, provide as v, onMounted as je, unref as X, onBeforeUnmount as w, h as R, inject as n, createCommentVNode as b, Teleport as ne, nextTick as He, warn as T, renderSlot as ee, createTextVNode as ae, isRef as Fe } from "vue";
import { Map as Ve, AttributionControl as $e, FullscreenControl as Ze, GeolocateControl as We, NavigationControl as qe, ScaleControl as De, Marker as Ge } from "maplibre-gl";
const y = Symbol("map"), p = Symbol("isLoaded"), S = Symbol("componentId"), M = Symbol("sourceId"), L = Symbol("sourceLayerRegistry"), P = Symbol("emitter"), m = te({
  style: "https://demotiles.maplibre.org/style.json",
  center: Object.freeze([0, 0]),
  zoom: 1,
  trackResize: !1
});
class I {
  static createEventHandler(t, o, a, r) {
    return (i = {}) => a.emit(r, { type: i.type, map: o, component: t, event: i });
  }
}
O(I, "MAP_OPTION_KEYS", [
  "antialias",
  "attributionControl",
  "bearing",
  "bearingSnap",
  "bounds",
  "boxZoom",
  "center",
  "clickTolerance",
  "collectResourceTiming",
  "crossSourceCollisions",
  "container",
  "customAttribution",
  "dragPan",
  "dragRotate",
  "doubleClickZoom",
  "hash",
  "fadeDuration",
  "failIfMajorPerformanceCaveat",
  "fitBoundsOptions",
  "interactive",
  "keyboard",
  "locale",
  "localIdeographFontFamily",
  "logoPosition",
  "maxBounds",
  "maxPitch",
  "maxZoom",
  "minPitch",
  "minZoom",
  "preserveDrawingBuffer",
  "pitch",
  "pitchWithRotate",
  "refreshExpiredTiles",
  "renderWorldCopies",
  "scrollZoom",
  "mapStyle",
  "trackResize",
  "transformRequest",
  "touchZoomRotate",
  "touchPitch",
  "zoom",
  "maxTileCacheSize",
  "accessToken"
]), O(I, "MARKER_OPTION_KEYS", [
  "element",
  "offset",
  "anchor",
  "color",
  "draggable",
  "clickTolerance",
  "rotation",
  "rotationAlignment",
  "pitchAlignment",
  "scale"
]), O(I, "MAP_EVENT_TYPES", [
  "error",
  "load",
  "idle",
  "remove",
  "render",
  "resize",
  "webglcontextlost",
  "webglcontextrestored",
  "dataloading",
  "data",
  "tiledataloading",
  "sourcedataloading",
  "styledataloading",
  "sourcedata",
  "styledata",
  "boxzoomcancel",
  "boxzoomstart",
  "boxzoomend",
  "touchcancel",
  "touchmove",
  "touchend",
  "touchstart",
  "click",
  "contextmenu",
  "dblclick",
  "mousemove",
  "mouseup",
  "mousedown",
  "mouseout",
  "mouseover",
  "movestart",
  "move",
  "moveend",
  "zoomstart",
  "zoom",
  "zoomend",
  "rotatestart",
  "rotate",
  "rotateend",
  "dragstart",
  "drag",
  "dragend",
  "pitchstart",
  "pitch",
  "pitchend",
  "wheel"
]);
var z = /* @__PURE__ */ ((e) => (e.TOP_LEFT = "top-left", e.TOP_RIGHT = "top-right", e.BOTTOM_LEFT = "bottom-left", e.BOTTOM_RIGHT = "bottom-right", e))(z || {});
const N = Object.values(z);
function k(e, t, o) {
  h(e, (a) => {
    a && N.indexOf(a) === -1 || (t.value.hasControl(o) && t.value.removeControl(o), t.value.addControl(o, a));
  }, { immediate: !0 });
}
function Ue(e) {
  return { all: e = e || /* @__PURE__ */ new Map(), on: function(t, o) {
    var a = e.get(t);
    a ? a.push(o) : e.set(t, [o]);
  }, off: function(t, o) {
    var a = e.get(t);
    a && (o ? a.splice(a.indexOf(o) >>> 0, 1) : e.set(t, []));
  }, emit: function(t, o) {
    var a = e.get(t);
    a && a.slice().map(function(r) {
      r(o);
    }), (a = e.get("*")) && a.slice().map(function(r) {
      r(t, o);
    });
  } };
}
const Y = /* @__PURE__ */ new Map(), se = Symbol("default");
function Ye(e = se) {
  let t = Y.get(e);
  return t || (t = te({ isLoaded: !1, isMounted: !1 }), Y.set(e, t)), t;
}
function Ke(e, t = se) {
  var a;
  let o = Y.get(t);
  return o || (o = te({ isLoaded: !1, isMounted: !1 }), Y.set(t, o)), o.isLoaded = !1, o.isMounted = !1, o.component = e, o.map = e.map, o.isLoaded = ((a = e.map) == null ? void 0 : a.loaded()) || !1, o;
}
function Je(e, t = 250, o = !1) {
  let a;
  function r() {
    const i = arguments, l = () => {
      a = void 0, o !== !0 && e.apply(this, i);
    };
    clearTimeout(a), o === !0 && a === void 0 && e.apply(this, i), a = window.setTimeout(l, t);
  }
  return r.cancel = () => {
    clearTimeout(a);
  }, r;
}
const le = f({
  name: "MglMap",
  props: {
    width: { type: [Number, String], default: "100%" },
    height: { type: [Number, String], default: "100%" },
    antialias: { type: Boolean, default: () => m.antialias },
    attributionControl: { type: Boolean, default: () => m.attributionControl },
    bearing: { type: Number, default: () => m.bearing },
    bearingSnap: { type: Number, default: () => m.bearingSnap },
    bounds: { type: [Array, Object], default: () => m.bounds },
    boxZoom: { type: Boolean, default: () => m.boxZoom },
    center: { type: [Array, Object], default: () => m.center },
    clickTolerance: { type: Number, default: () => m.clickTolerance },
    collectResourceTiming: { type: Boolean, default: () => m.collectResourceTiming },
    crossSourceCollisions: { type: Boolean, default: () => m.crossSourceCollisions },
    customAttribution: { type: [String, Array], default: () => m.customAttribution },
    dragPan: { type: Boolean, default: () => m.dragPan },
    dragRotate: { type: Boolean, default: () => m.dragRotate },
    doubleClickZoom: { type: Boolean, default: () => m.doubleClickZoom },
    hash: { type: [Boolean, String], default: () => m.hash },
    fadeDuration: { type: Number, default: () => m.fadeDuration },
    failIfMajorPerformanceCaveat: { type: Boolean, default: () => m.failIfMajorPerformanceCaveat },
    fitBoundsOptions: { type: Object, default: () => m.fitBoundsOptions },
    interactive: { type: Boolean, default: () => m.interactive },
    keyboard: { type: Boolean, default: () => m.keyboard },
    locale: { type: Object, default: () => m.locale },
    localIdeographFontFamily: { type: String, default: () => m.localIdeographFontFamily },
    logoPosition: {
      type: [String],
      validate: (e) => e in z,
      default: () => m.logoPosition
    },
    maxBounds: { type: [Array, Object], default: () => m.maxBounds },
    maxPitch: { type: Number, default: () => m.maxPitch },
    maxZoom: { type: Number, default: () => m.maxZoom },
    minPitch: { type: Number, default: () => m.minPitch },
    minZoom: { type: Number, default: () => m.minZoom },
    preserveDrawingBuffer: { type: Boolean, default: () => m.preserveDrawingBuffer },
    pitch: { type: Number, default: () => m.pitch },
    pitchWithRotate: { type: Boolean, default: () => m.pitchWithRotate },
    refreshExpiredTiles: { type: Boolean, default: () => m.refreshExpiredTiles },
    renderWorldCopies: { type: Boolean, default: () => m.renderWorldCopies },
    scrollZoom: { type: Boolean, default: () => m.scrollZoom },
    mapStyle: { type: [String, Object], default: () => m.style },
    trackResize: { type: Boolean, default: () => m.trackResize },
    transformRequest: { type: Function, default: m.transformRequest },
    touchZoomRotate: { type: Boolean, default: () => m.touchZoomRotate },
    touchPitch: { type: Boolean, default: () => m.touchPitch },
    zoom: { type: Number, default: () => m.zoom },
    maxTileCacheSize: { type: Number, default: () => m.maxTileCacheSize },
    accessToken: { type: String, default: () => m.accessToken },
    mapKey: { type: [String, Symbol] }
  },
  emits: [
    "map:error",
    "map:load",
    "map:idle",
    "map:remove",
    "map:render",
    "map:resize",
    "map:webglcontextlost",
    "map:webglcontextrestored",
    "map:dataloading",
    "map:data",
    "map:tiledataloading",
    "map:sourcedataloading",
    "map:styledataloading",
    "map:sourcedata",
    "map:styledata",
    "map:boxzoomcancel",
    "map:boxzoomstart",
    "map:boxzoomend",
    "map:touchcancel",
    "map:touchmove",
    "map:touchend",
    "map:touchstart",
    "map:click",
    "map:contextmenu",
    "map:dblclick",
    "map:mousemove",
    "map:mouseup",
    "map:mousedown",
    "map:mouseout",
    "map:mouseover",
    "map:movestart",
    "map:move",
    "map:moveend",
    "map:zoomstart",
    "map:zoom",
    "map:zoomend",
    "map:rotatestart",
    "map:rotate",
    "map:rotateend",
    "map:dragstart",
    "map:drag",
    "map:dragend",
    "map:pitchstart",
    "map:pitch",
    "map:pitchend",
    "map:wheel"
  ],
  setup(e, t) {
    const o = oe(_()), a = Q(null), r = Q(null), i = Q(null), l = H(!1), d = H(!1), u = /* @__PURE__ */ new Map(), g = Ue(), A = Ke(o, e.mapKey);
    let $;
    return v(y, i), v(p, d), v(S, o.uid), v(M, ""), v(P, g), h(() => e.bearing, (c) => {
      var s;
      c && ((s = i.value) == null || s.setBearing(c));
    }), h(() => e.bounds, (c) => {
      var s;
      c && ((s = i.value) == null || s.fitBounds(c, e.fitBoundsOptions));
    }), h(() => e.center, (c) => {
      var s;
      c && ((s = i.value) == null || s.setCenter(c));
    }), h(() => e.maxBounds, (c) => {
      var s;
      c && ((s = i.value) == null || s.setMaxBounds(c));
    }), h(() => e.maxPitch, (c) => {
      var s;
      c && ((s = i.value) == null || s.setMaxPitch(c));
    }), h(() => e.maxZoom, (c) => {
      var s;
      c && ((s = i.value) == null || s.setMaxZoom(c));
    }), h(() => e.minPitch, (c) => {
      var s;
      c && ((s = i.value) == null || s.setMinPitch(c));
    }), h(() => e.minZoom, (c) => {
      var s;
      c && ((s = i.value) == null || s.setMinZoom(c));
    }), h(() => e.pitch, (c) => {
      var s;
      c && ((s = i.value) == null || s.setPitch(c));
    }), h(() => e.renderWorldCopies, (c) => {
      var s;
      c && ((s = i.value) == null || s.setRenderWorldCopies(c));
    }), h(() => e.mapStyle, (c) => {
      var s;
      c && ((s = i.value) == null || s.setStyle(c));
    }), h(() => e.transformRequest, (c) => {
      var s;
      c && ((s = i.value) == null || s.setTransformRequest(c));
    }), h(() => e.zoom, (c) => {
      var s;
      c && ((s = i.value) == null || s.setZoom(c));
    }), h(() => e.zoom, (c) => {
      var s;
      c && ((s = i.value) == null || s.setZoom(c));
    }), je(() => {
      A.isMounted = !0;
      const c = Object.keys(e).filter((s) => e[s] !== void 0 && I.MAP_OPTION_KEYS.indexOf(s) !== -1).reduce((s, x) => (s[x === "mapStyle" ? "style" : x] = X(e[x]), s), { container: r.value });
      if (i.value = oe(new Ve(c)), A.map = i.value, l.value = !0, u.set("__load", () => (d.value = !0, A.isLoaded = !0)), i.value.on("load", u.get("__load")), o.vnode.props) {
        for (let s = 0, x = I.MAP_EVENT_TYPES.length; s < x; s++)
          if (o.vnode.props["onMap:" + I.MAP_EVENT_TYPES[s]]) {
            const G = I.createEventHandler(o, i.value, t, "map:" + I.MAP_EVENT_TYPES[s]);
            u.set(I.MAP_EVENT_TYPES[s], G), i.value.on(I.MAP_EVENT_TYPES[s], G);
          }
      }
      $ = new ResizeObserver(Je(i.value.resize.bind(i.value), 100)), $.observe(r.value);
    }), w(() => {
      A.isMounted = !1, A.isLoaded = !1, $ && $.disconnect(), i.value && u.forEach((c, s) => {
        i.value.off(s.startsWith("__") ? s.substr(2) : s, c);
      });
    }), {
      map: i,
      componentContainer: a,
      container: r,
      isLoaded: d,
      isInitialized: l
    };
  },
  render() {
    return R(
      "div",
      {
        ref: "componentContainer",
        class: "mgl-container",
        style: { height: this.$props.height, width: this.$props.width }
      },
      [
        R("div", { ref: "container", class: "mgl-wrapper" }),
        this.isInitialized && this.$slots.default ? this.$slots.default() : void 0
      ]
    );
  }
}), ue = f({
  name: "MglAttributionControl",
  props: {
    position: {
      type: String,
      validator: (e) => N.indexOf(e) !== -1
    },
    compact: Boolean,
    customAttribution: [String, Array]
  },
  setup(e) {
    const t = n(y), o = new $e({ compact: e.compact, customAttribution: e.customAttribution });
    k(() => e.position, t, o), w(() => t.value.removeControl(o));
  },
  render() {
  }
}), D = class {
  constructor(t, o) {
    O(this, "container");
    this.isAdded = t, this.container = document.createElement("div"), this.setClasses(o);
  }
  getDefaultPosition() {
    return z.TOP_LEFT;
  }
  onAdd() {
    return He(() => this.isAdded.value = !0), this.container;
  }
  onRemove() {
    this.isAdded.value = !1, this.container.remove();
  }
  setClasses(t) {
    t ? (this.container.classList.remove(D.CONTROL_CLASS), this.container.classList.remove(D.CONTROL_GROUP_CLASS)) : (this.container.classList.add(D.CONTROL_CLASS), this.container.classList.add(D.CONTROL_GROUP_CLASS));
  }
};
let q = D;
O(q, "CONTROL_CLASS", "maplibregl-ctrl"), O(q, "CONTROL_GROUP_CLASS", "maplibregl-ctrl-group");
const ce = f({
  name: "MglCustomControl",
  props: {
    position: {
      type: String,
      validator: (e) => N.indexOf(e) !== -1
    },
    noClasses: {
      type: Boolean,
      default: !1
    }
  },
  setup(e) {
    const t = n(y), o = H(!1), a = new q(o, e.noClasses);
    return k(() => e.position, t, a), h(() => e.noClasses, (r) => a.setClasses(r)), w(() => {
      t.value.removeControl(a);
    }), { isAdded: o, container: a.container };
  },
  render() {
    return this.isAdded ? R(
      ne,
      { to: this.container },
      this.$slots.default ? this.$slots.default() : void 0
    ) : b("custom-component");
  }
}), de = f({
  name: "MglFullscreenControl",
  props: {
    position: {
      type: String,
      default: z.TOP_RIGHT,
      validator: (e) => N.indexOf(e) !== -1
    },
    container: {
      type: HTMLElement,
      default: null
    }
  },
  setup(e) {
    const t = n(y), o = new Ze(e.container ? { container: e.container } : void 0);
    k(() => e.position, t, o), w(() => t.value.removeControl(o));
  },
  render() {
  }
});
class Xe {
  constructor(t = "rgba(0,0,0,0.9)", o = 4 * window.devicePixelRatio, a = "#7cf859", r = "Monaco, Consolas, Courier, monospace", i = 60 * window.devicePixelRatio, l = 90 * window.devicePixelRatio, d = 0, u = 5 * window.devicePixelRatio, g = 100 * window.devicePixelRatio) {
    O(this, "frames", 0);
    O(this, "totalTime", 0);
    O(this, "totalFrames", 0);
    O(this, "time", null);
    O(this, "map");
    O(this, "container");
    O(this, "readOutput");
    O(this, "canvas");
    O(this, "eventHandlers", /* @__PURE__ */ new Map());
    this.background = t, this.barWidth = o, this.color = a, this.font = r, this.graphHeight = i, this.graphWidth = l, this.graphTop = d, this.graphRight = u, this.width = g;
  }
  getDefaultPosition() {
    return z.TOP_RIGHT;
  }
  onAdd(t) {
    this.map = t;
    const o = this.container = document.createElement("div");
    return o.className = "mapboxgl-ctrl mapboxgl-ctrl-fps", o.style.backgroundColor = this.background, o.style.borderRadius = "6px", this.readOutput = document.createElement("div"), this.readOutput.style.color = this.color, this.readOutput.style.fontFamily = this.font, this.readOutput.style.padding = "0 5px 5px", this.readOutput.style.fontSize = "9px", this.readOutput.style.fontWeight = "bold", this.readOutput.textContent = "Waiting\u2026", this.canvas = document.createElement("canvas"), this.canvas.className = "mapboxgl-ctrl-canvas", this.canvas.width = this.width, this.canvas.height = this.graphHeight, this.canvas.style.cssText = `width: ${this.width / window.devicePixelRatio}px; height: ${this.graphHeight / window.devicePixelRatio}px;`, o.appendChild(this.readOutput), o.appendChild(this.canvas), this.eventHandlers.set("movestart", this.onMoveStart.bind(this)), this.eventHandlers.set("moveend", this.onMoveEnd.bind(this)), this.map.on("movestart", this.eventHandlers.get("movestart")), this.map.on("moveend", this.eventHandlers.get("moveend")), this.container;
  }
  onRemove() {
    this.map.off("movestart", this.eventHandlers.get("movestart")), this.map.off("moveend", this.eventHandlers.get("moveend")), this.eventHandlers.clear(), this.container.parentNode.removeChild(this.container), this.map = void 0;
  }
  onMoveStart() {
    this.frames = 0, this.time = performance.now(), this.eventHandlers.set("render", this.onRender.bind(this)), this.map.on("render", this.eventHandlers.get("render"));
  }
  onMoveEnd() {
    const t = performance.now();
    this.updateGraph(this.getFPS(t)), this.frames = 0, this.time = null, this.map.off("render", this.eventHandlers.get("render"));
  }
  onRender() {
    if (this.time) {
      this.frames++;
      const t = performance.now();
      t >= this.time + 1e3 && (this.updateGraph(this.getFPS(t)), this.frames = 0, this.time = performance.now());
    }
  }
  getFPS(t) {
    return this.totalTime += t - this.time, this.totalFrames += this.frames, Math.round(1e3 * this.frames / (t - this.time)) || 0;
  }
  updateGraph(t) {
    const o = this.canvas.getContext("2d"), a = Math.round(1e3 * this.totalFrames / this.totalTime) || 0, r = (this.graphHeight, this.barWidth);
    o.fillStyle = this.background, o.globalAlpha = 1, o.fillRect(0, 0, this.graphWidth, this.graphTop), o.fillStyle = this.color, this.readOutput.textContent = `${t} FPS (${a} Avg)`, o.drawImage(
      this.canvas,
      this.graphRight + r,
      this.graphTop,
      this.graphWidth - r,
      this.graphHeight,
      this.graphRight,
      this.graphTop,
      this.graphWidth - r,
      this.graphHeight
    ), o.fillRect(
      this.graphRight + this.graphWidth - r,
      this.graphTop,
      r,
      this.graphHeight
    ), o.fillStyle = this.background, o.globalAlpha = 0.75, o.fillRect(
      this.graphRight + this.graphWidth - r,
      this.graphTop,
      r,
      (1 - t / 100) * this.graphHeight
    );
  }
}
const me = f({
  name: "MglFrameRateControl",
  props: {
    position: {
      type: String,
      validator: (e) => N.indexOf(e) !== -1
    },
    background: {
      type: String,
      default: "rgba(0,0,0,0.9)"
    },
    barWidth: {
      type: Number,
      default: 4 * window.devicePixelRatio
    },
    color: {
      type: String,
      default: "#7cf859"
    },
    font: {
      type: String,
      default: "Monaco, Consolas, Courier, monospace"
    },
    graphHeight: {
      type: Number,
      default: 60 * window.devicePixelRatio
    },
    graphWidth: {
      type: Number,
      default: 90 * window.devicePixelRatio
    },
    graphTop: {
      type: Number,
      default: 0
    },
    graphRight: {
      type: Number,
      default: 5 * window.devicePixelRatio
    },
    width: {
      type: Number,
      default: 100 * window.devicePixelRatio
    }
  },
  setup(e) {
    const t = n(y), o = new Xe(
      e.background,
      e.barWidth,
      e.color,
      e.font,
      e.graphHeight,
      e.graphWidth,
      e.graphTop,
      e.graphRight,
      e.width
    );
    k(() => e.position, t, o), w(() => t.value.removeControl(o));
  },
  render() {
  }
}), he = f({
  name: "MglGeolocationControl",
  props: {
    position: {
      type: String,
      default: z.TOP_RIGHT,
      validator: (e) => N.indexOf(e) !== -1
    },
    positionOptions: {
      type: Object,
      default: { enableHighAccuracy: !1, timeout: 6e3 }
    },
    fitBoundsOptions: {
      type: Object,
      default: { maxZoom: 15 }
    },
    trackUserLocation: {
      type: Boolean,
      default: !1
    },
    showAccuracyCircle: {
      type: Boolean,
      default: !0
    },
    showUserLocation: {
      type: Boolean,
      default: !0
    }
  },
  setup(e) {
    const t = n(y), o = new We({
      positionOptions: e.positionOptions,
      fitBoundsOptions: e.fitBoundsOptions,
      trackUserLocation: e.trackUserLocation,
      showAccuracyCircle: e.showAccuracyCircle,
      showUserLocation: e.showUserLocation
    });
    k(() => e.position, t, o), w(() => t.value.removeControl(o));
  },
  render() {
  }
}), ge = f({
  name: "MglNavigationControl",
  props: {
    position: {
      type: String,
      default: z.TOP_RIGHT,
      validator: (e) => N.indexOf(e) !== -1
    },
    showCompass: { type: Boolean, default: !0 },
    showZoom: { type: Boolean, default: !0 },
    visualizePitch: Boolean
  },
  setup(e) {
    const t = n(y), o = new qe({ showCompass: e.showCompass, showZoom: e.showZoom, visualizePitch: e.visualizePitch });
    k(() => e.position, t, o), w(() => t.value.removeControl(o));
  },
  render() {
  }
});
var fe = /* @__PURE__ */ ((e) => (e.IMPERIAL = "imperial", e.METRIC = "metric", e.NAUTICAL = "nautical", e))(fe || {});
const Qe = Object.values(fe), ye = f({
  name: "MglScaleControl",
  props: {
    position: {
      type: String,
      validator: (e) => N.indexOf(e) !== -1
    },
    maxWidth: { type: Number, default: 100 },
    unit: {
      type: String,
      default: "metric",
      validator: (e) => Qe.indexOf(e) !== -1
    }
  },
  setup(e) {
    const t = n(y), o = new De({ maxWidth: e.maxWidth, unit: e.unit });
    k(() => e.position, t, o), w(() => t.value.removeControl(o));
  },
  render() {
  }
});
var K = /* @__PURE__ */ ((e) => (e.DEFAULT = "default", e.TEXT = "text", e.MDI = "mdi", e.SIMPLE_ICON = "simple-icons", e))(K || {});
const et = Object.values(K), U = {
  text: void 0,
  mdi: {
    size: 21,
    viewbox: "0 0 24 24"
  },
  ["simple-icons"]: {
    size: 21,
    viewbox: "0 0 24 24"
  },
  default: {
    size: 0,
    viewbox: "0 0 0 0"
  }
}, J = f({
  name: "MglButton",
  props: {
    type: {
      type: String,
      default: "default",
      validator: (e) => et.indexOf(e) !== -1
    },
    path: {
      type: String
    },
    size: Number,
    viewbox: String
  },
  setup(e) {
    !e.path && e.type !== "text" && T("property `path` must be set on MaplibreButton");
    const t = H(U[e.type] || U.default);
    return h(() => e.type, (o) => t.value = U[o] || U.default), { defaults: t };
  },
  render() {
    return this.type === "text" ? R("button", { type: "button" }, this.$slots.default ? this.$slots.default() : void 0) : R(
      "button",
      { type: "button", class: "maplibregl-ctrl-icon" },
      [
        R(
          "svg",
          {
            width: this.size || this.defaults.size,
            height: this.size || this.defaults.size,
            viewBox: this.viewbox || this.defaults.viewbox
          },
          R("path", { fill: "currentColor", d: this.path })
        ),
        this.$slots.default ? this.$slots.default() : void 0
      ]
    );
  }
});
var tt = "M12,18.54L19.37,12.8L21,14.07L12,21.07L3,14.07L4.62,12.81L12,18.54M12,16L3,9L12,2L21,9L12,16M12,4.53L6.26,9L12,13.47L17.74,9L12,4.53Z";
function re(e) {
  return e && !!e.stopPropagation;
}
const ve = f({
  name: "MglStyleSwitchControl",
  props: {
    position: {
      type: String,
      validator: (e) => N.indexOf(e) !== -1
    },
    mapStyles: {
      type: Array,
      required: !0,
      default: []
    },
    modelValue: {
      type: Object
    },
    isOpen: {
      type: Boolean,
      default: void 0
    }
  },
  emits: ["update:modelValue", "update:isOpen"],
  setup(e, t) {
    const o = n(y), a = n(p), r = n(P), i = H(!1), l = H(e.isOpen === void 0 ? !1 : e.isOpen), d = H(e.modelValue === void 0 ? e.mapStyles.length ? e.mapStyles[0] : null : e.modelValue), u = new q(i, !1), g = c.bind(null, !1);
    function A() {
      const s = o.value.getStyle().name;
      for (let x = 0, G = e.mapStyles.length; x < G; x++)
        if (e.mapStyles[x].name === s) {
          $(e.mapStyles[x]);
          break;
        }
    }
    h(a, (s) => {
      s && A();
    }, { immediate: !0 }), o.value.on("style.load", A), document.addEventListener("click", g), k(() => e.position, o, u), e.modelValue !== void 0 && h(() => e.modelValue, (s) => {
      s !== void 0 && (d.value = s);
    }), e.isOpen !== void 0 && h(() => e.isOpen, (s) => {
      s !== void 0 && (l.value = s);
    }), w(() => {
      o.value.removeControl(u), o.value.off("style.load", A), document.removeEventListener("click", g);
    });
    function $(s) {
      var x;
      ((x = d.value) == null ? void 0 : x.name) !== s.name && (r.emit("styleSwitched", s), o.value.setStyle(s.style), e.modelValue === void 0 && (d.value = s), t.emit("update:modelValue", s), c(!1));
    }
    function c(s, x) {
      re(x) ? x.stopPropagation() : re(s) && s.stopPropagation(), !(e.isOpen !== void 0 && e.isOpen === s || l.value === s) && (e.isOpen === void 0 ? (l.value = typeof s == "boolean" ? s : !l.value, t.emit("update:isOpen", l.value)) : t.emit("update:isOpen", typeof s == "boolean" ? s : !e.isOpen));
    }
    return { isAdded: i, container: u.container, setStyle: $, toggleOpen: c, intIsOpen: l, intModelValue: d };
  },
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
    if (!this.isAdded)
      return b("style-switch-control");
    const e = {
      isOpen: this.intIsOpen,
      currentStyle: this.intModelValue,
      mapStyles: this.mapStyles,
      toggleOpen: this.toggleOpen,
      setStyle: this.setStyle
    };
    return R(
      ne,
      { to: this.container },
      ee(this.$slots, "default", e, () => [
        ee(this.$slots, "button", e, () => [R(J, {
          type: K.MDI,
          path: tt,
          class: ["maplibregl-ctrl-icon maplibregl-style-switch", this.intIsOpen ? "is-open" : ""],
          onClick: this.toggleOpen.bind(null, !0)
        })]),
        ee(this.$slots, "styleList", e, () => [
          R(
            "div",
            { class: ["maplibregl-style-list", this.intIsOpen ? "is-open" : ""] },
            this.mapStyles.map((t) => {
              var o, a;
              return t.icon ? R(J, {
                type: K.MDI,
                path: t.icon.path,
                class: ((o = this.intModelValue) == null ? void 0 : o.name) === t.name ? "is-active" : "",
                onClick: () => this.setStyle(t)
              }, ae(t.label)) : R("button", {
                type: "button",
                class: ((a = this.intModelValue) == null ? void 0 : a.name) === t.name ? "is-active" : "",
                onClick: () => this.setStyle(t)
              }, ae(t.label));
            })
          )
        ])
      ])
    );
  }
}), pe = f({
  name: "MglMarker",
  props: {
    coordinates: {
      type: [Object, Array],
      required: !0
    },
    offset: [Object, Array],
    anchor: String,
    color: String,
    clickTolerance: Number,
    rotation: Number,
    rotationAlignment: String,
    pitchAlignment: String,
    scale: Number
  },
  setup(e) {
    const t = n(y), o = Object.keys(e).filter((r) => e[r] !== void 0 && I.MARKER_OPTION_KEYS.indexOf(r) !== -1).reduce((r, i) => (r[i] = X(e[i]), r), {}), a = new Ge(o);
    return a.setLngLat(e.coordinates).addTo(t.value), h(() => e.coordinates, (r) => a.setLngLat(r)), h(() => e.offset, (r) => a.setOffset(r || [0, 0])), h(() => e.pitchAlignment, (r) => a.setPitchAlignment(r || "auto")), h(() => e.rotationAlignment, (r) => a.setRotationAlignment(r || "auto")), w(a.remove.bind(a)), { marker: a };
  },
  render() {
  }
});
function ot(e, t, o) {
  return Object.keys(t).filter((a) => t[a] !== void 0 && o.indexOf(a) !== -1).reduce((a, r) => (a[r] = X(t[r]), a), { type: e });
}
const ie = /* @__PURE__ */ new Map();
function C(e, t) {
  const o = typeof t == "string", a = String(e) + (o ? t : "");
  let r = ie.get(a);
  return r || (r = H(o ? null : void 0), ie.set(a, r)), r;
}
function Z(e, t, o, a, r, i, l, d) {
  function u() {
    o.value && (e.value.addSource(r.sourceId, ot(i, r, l)), t.value = e.value.getSource(r.sourceId));
  }
  function g() {
    t.value = null;
  }
  return h(o, u, { immediate: !0 }), e.value.on("style.load", u), a.on("styleSwitched", g), w(() => {
    o.value && (d.unmount(), e.value.removeSource(r.sourceId)), e.value.off("style.load", u), a.off("styleSwitched", g);
  });
}
class W {
  constructor() {
    O(this, "unmountHandlers", /* @__PURE__ */ new Map());
  }
  registerUnmountHandler(t, o) {
    this.unmountHandlers.set(t, o);
  }
  unregisterUnmountHandler(t) {
    this.unmountHandlers.delete(t);
  }
  unmount() {
    this.unmountHandlers.forEach((t) => t());
  }
}
const at = ["animate", "coordinates", "canvas"], be = f({
  name: "MglCanvasSource",
  props: {
    sourceId: {
      type: String,
      required: !0
    },
    coordinates: Array,
    animate: Boolean,
    canvas: [HTMLCanvasElement, String]
  },
  setup(e) {
    const t = n(y), o = n(p), a = n(P), r = n(S), i = C(r, e.sourceId), l = new W();
    return v(M, e.sourceId), v(L, l), Z(t, i, o, a, e, "canvas", at, l), h(() => e.coordinates, (d) => {
      var u;
      return (u = i.value) == null ? void 0 : u.setCoordinates(d || []);
    }), { source: i };
  },
  render() {
    return [
      b("Canvas Source"),
      this.source && this.$slots.default ? this.$slots.default() : void 0
    ];
  }
}), rt = [
  "data",
  "maxzoom",
  "attribution",
  "buffer",
  "tolerance",
  "cluster",
  "clusterRadius",
  "clusterMaxZoom",
  "clusterMinPoints",
  "clusterProperties",
  "lineMetrics",
  "generateId",
  "promoteId",
  "filter"
], Se = f({
  name: "MglGeoJsonSource",
  props: {
    sourceId: {
      type: String,
      required: !0
    },
    data: [Object, String],
    maxzoom: Number,
    attribution: String,
    buffer: Number,
    tolerance: Number,
    cluster: [Number, Boolean],
    clusterRadius: Number,
    clusterMaxZoom: Number,
    clusterMinPoints: Number,
    clusterProperties: Object,
    lineMetrics: Boolean,
    generateId: Boolean,
    promoteId: Object,
    filter: [Array, String, Object]
  },
  setup(e) {
    const t = n(y), o = n(p), a = n(P), r = n(S), i = C(r, e.sourceId), l = new W();
    return v(M, e.sourceId), v(L, l), Z(t, i, o, a, e, "geojson", rt, l), h(Fe(e.data) ? e.data : () => e.data, (d) => {
      var u;
      return (u = i.value) == null ? void 0 : u.setData(d || { type: "FeatureCollection", features: [] });
    }), { source: i };
  },
  render() {
    return [
      b("GeoJSON Source"),
      this.source && this.$slots.default ? this.$slots.default() : void 0
    ];
  }
}), it = ["url", "coordinates"], Me = f({
  name: "MglImageSource",
  props: {
    sourceId: {
      type: String,
      required: !0
    },
    url: String,
    coordinates: Array
  },
  setup(e) {
    const t = n(y), o = n(p), a = n(P), r = n(S), i = C(r, e.sourceId), l = new W();
    return v(M, e.sourceId), v(L, l), Z(t, i, o, a, e, "image", it, l), h(() => e.coordinates, (d) => {
      var u;
      return (u = i.value) == null ? void 0 : u.setCoordinates(d || []);
    }), { source: i };
  },
  render() {
    return [
      b("Image Source"),
      this.source && this.$slots.default ? this.$slots.default() : void 0
    ];
  }
}), nt = ["url", "tiles", "bounds", "minzoom", "maxzoom", "tileSize", "scheme", "attribution"], Oe = f({
  name: "MglRasterSource",
  props: {
    sourceId: {
      type: String,
      required: !0
    },
    url: String,
    tiles: Array,
    bounds: Array,
    minzoom: Number,
    maxzoom: Number,
    tileSize: Number,
    scheme: String,
    attribution: String
  },
  setup(e) {
    const t = n(y), o = n(p), a = n(P), r = n(S), i = C(r, e.sourceId), l = new W();
    return v(M, e.sourceId), v(L, l), Z(t, i, o, a, e, "raster", nt, l), { source: i };
  },
  render() {
    return b("Video Source");
  }
}), st = ["url", "tiles", "bounds", "minzoom", "maxzoom", "tileSize", "attribution", "encoding"], Le = f({
  name: "MglRasterDemSource",
  props: {
    sourceId: {
      type: String,
      required: !0
    },
    url: String,
    tiles: Array,
    bounds: Array,
    minzoom: Number,
    maxzoom: Number,
    tileSize: Number,
    attribution: String,
    encoding: String
  },
  setup(e) {
    const t = n(y), o = n(p), a = n(P), r = n(S), i = C(r, e.sourceId), l = new W();
    return v(M, e.sourceId), v(L, l), Z(t, i, o, a, e, "raster-dem", st, l), { source: i };
  },
  render() {
    return b("Video Source");
  }
}), lt = ["url", "tiles", "bounds", "scheme", "minzoom", "maxzoom", "attribution", "promoteId"], xe = f({
  name: "MglVectorSource",
  props: {
    sourceId: {
      type: String,
      required: !0
    },
    url: String,
    tiles: Array,
    bounds: Array,
    scheme: String,
    minzoom: Number,
    maxzoom: Number,
    attribution: String,
    promoteId: Object
  },
  setup(e) {
    const t = n(y), o = n(p), a = n(P), r = n(S), i = C(r, e.sourceId), l = new W();
    return v(M, e.sourceId), v(L, l), Z(t, i, o, a, e, "vector", lt, l), h(() => e.tiles, (d) => {
      var u;
      return (u = i.value) == null ? void 0 : u.setTiles(d || []);
    }), h(() => e.url, (d) => {
      var u;
      return (u = i.value) == null ? void 0 : u.setUrl(d || "");
    }), { source: i };
  },
  render() {
    return b("Vector Source");
  }
}), ut = ["urls", "coordinates"], Ce = f({
  name: "MglVideoSource",
  props: {
    sourceId: {
      type: String,
      required: !0
    },
    urls: Array,
    coordinates: Array
  },
  setup(e) {
    const t = n(y), o = n(p), a = n(P), r = n(S), i = C(r, e.sourceId), l = new W();
    return v(M, e.sourceId), v(L, l), Z(t, i, o, a, e, "video", ut, l), h(() => e.coordinates, (d) => {
      var u;
      return (u = i.value) == null ? void 0 : u.setCoordinates(d || []);
    }), { source: i };
  },
  render() {
    return b("Video Source");
  }
}), ct = [
  "metadata",
  "ref",
  "source",
  "sourceLayer",
  "minzoom",
  "maxzoom",
  "interactive",
  "filter",
  "layout",
  "paint"
], j = [
  "click",
  "dblclick",
  "mousedown",
  "mouseup",
  "mousemove",
  "mouseenter",
  "mouseleave",
  "mouseover",
  "mouseout",
  "contextmenu",
  "touchstart",
  "touchend",
  "touchcancel"
], B = f({
  props: {
    layerId: {
      type: String,
      required: !0
    },
    source: [String, Object],
    metadata: [Object, Array, String, Number],
    ref: String,
    sourceLayer: String,
    minzoom: Number,
    maxzoom: Number,
    interactive: Boolean,
    filter: Array,
    before: String
  },
  emit: [
    "click",
    "dblclick",
    "mousedown",
    "mouseup",
    "mousemove",
    "mouseenter",
    "mouseleave",
    "mouseover",
    "mouseout",
    "contextmenu",
    "touchstart",
    "touchend",
    "touchcancel"
  ]
});
function E(e, t, o, a) {
  return Object.keys(o).filter((r) => o[r] !== void 0 && ct.indexOf(r) !== -1).reduce((r, i) => (r[i === "sourceLayer" ? "source-layer" : i] = X(o[i]), r), { type: t, source: o.source || a, id: e });
}
function F(e, t, o) {
  if (!!o.props)
    for (let a = 0, r = j.length; a < r; a++) {
      const i = "on" + j[a].charAt(0).toUpperCase() + j[a].substr(1);
      o.props[i] && e.on(j[a], t, o.props[i]);
    }
}
function dt(e, t, o) {
  if (!!o.props)
    for (let a = 0, r = j.length; a < r; a++) {
      const i = "on" + j[a].charAt(0).toUpperCase() + j[a].substr(1);
      o.props[i] && e.off(j[a], t, o.props[i]);
    }
}
function V(e, t, o, a, r) {
  function i() {
    e.value && (dt(t.value, a.layerId, o.vnode), t.value.getLayer(a.layerId) && t.value.removeLayer(a.layerId));
  }
  r.registerUnmountHandler(a.layerId, i), w(() => {
    r.unregisterUnmountHandler(a.layerId), i();
  });
}
const we = f({
  name: "MglBackgroundLayer",
  mixins: [B],
  props: {
    layout: Object,
    paint: Object
  },
  setup(e) {
    const t = n(M);
    if (!t && !e.source) {
      T("Background Layer: layer must be used inside source tag or source prop must be set");
      return;
    }
    const o = n(y), a = n(p), r = n(S), i = n(L), l = C(r, e.source || t);
    h([a, l], ([u, g]) => {
      u && (g || g === void 0) && o.value.addLayer(E(e.layerId, "background", e, t), e.before || void 0);
    }, { immediate: !0 });
    function d() {
      a.value && o.value.removeLayer(e.layerId);
    }
    i.registerUnmountHandler(e.layerId, d), w(() => {
      d();
    });
  },
  render() {
    return b("Background Layer");
  }
}), Re = f({
  name: "MglCircleLayer",
  mixins: [B],
  props: {
    layout: Object,
    paint: Object
  },
  setup(e) {
    const t = n(M);
    if (!t && !e.source) {
      T("Circle Layer: layer must be used inside source tag or source prop must be set");
      return;
    }
    const o = _(), a = n(y), r = n(p), i = n(S), l = n(L), d = C(i, e.source || t);
    h([r, d], ([u, g]) => {
      u && (g || g === void 0) && (a.value.addLayer(E(e.layerId, "circle", e, t), e.before || void 0), F(a.value, e.layerId, o.vnode));
    }, { immediate: !0 }), V(r, a, o, e, l);
  },
  render() {
    return b("Circle Layer");
  }
}), Ie = f({
  name: "MglFillLayer",
  mixins: [B],
  props: {
    layout: Object,
    paint: Object
  },
  setup(e) {
    const t = n(M);
    if (!t && !e.source) {
      T("Fill Layer: layer must be used inside source tag or source prop must be set");
      return;
    }
    const o = _(), a = n(y), r = n(p), i = n(S), l = n(L), d = C(i, e.source || t);
    h([r, d], ([u, g]) => {
      u && (g || g === void 0) && (a.value.addLayer(E(e.layerId, "fill", e, t), e.before || void 0), F(a.value, e.layerId, o.vnode));
    }, { immediate: !0 }), V(r, a, o, e, l);
  },
  render() {
    return b("Fill Layer");
  }
}), Te = f({
  name: "MglFillExtrusionLayer",
  mixins: [B],
  props: {
    layout: Object,
    paint: Object
  },
  setup(e) {
    const t = n(M);
    if (!t && !e.source) {
      T("Fill Extrude Layer: layer must be used inside source tag or source prop must be set");
      return;
    }
    const o = _(), a = n(y), r = n(p), i = n(S), l = n(L), d = C(i, e.source || t);
    h([r, d], ([u, g]) => {
      u && (g || g === void 0) && (a.value.addLayer(E(e.layerId, "fill-extrusion", e, t), e.before || void 0), F(a.value, e.layerId, o.vnode));
    }, { immediate: !0 }), V(r, a, o, e, l);
  },
  render() {
    return b("Fill Extrusion Layer");
  }
}), Pe = f({
  name: "MglHeatmapLayer",
  mixins: [B],
  props: {
    layout: Object,
    paint: Object
  },
  setup(e) {
    const t = n(M);
    if (!t && !e.source) {
      T("Heatmap Layer: layer must be used inside source tag or source prop must be set");
      return;
    }
    const o = _(), a = n(y), r = n(p), i = n(S), l = n(L), d = C(i, e.source || t);
    h([r, d], ([u, g]) => {
      u && (g || g === void 0) && (a.value.addLayer(E(e.layerId, "heatmap", e, t), e.before || void 0), F(a.value, e.layerId, o.vnode));
    }, { immediate: !0 }), V(r, a, o, e, l);
  },
  render() {
    return b("Heatmap Layer");
  }
}), Ae = f({
  name: "MglHillshadeLayer",
  mixins: [B],
  props: {
    layout: Object,
    paint: Object
  },
  setup(e) {
    const t = n(M);
    if (!t && !e.source) {
      T("Hillshade Layer: layer must be used inside source tag or source prop must be set");
      return;
    }
    const o = _(), a = n(y), r = n(p), i = n(S), l = n(L), d = C(i, e.source || t);
    h([r, d], ([u, g]) => {
      u && (g || g === void 0) && (a.value.addLayer(E(e.layerId, "hillshade", e, t), e.before || void 0), F(a.value, e.layerId, o.vnode));
    }, { immediate: !0 }), V(r, a, o, e, l);
  },
  render() {
    return b("Hillshade Layer");
  }
}), _e = f({
  name: "MglLineLayer",
  mixins: [B],
  props: {
    layout: Object,
    paint: Object
  },
  setup(e) {
    const t = n(M);
    if (!t && !e.source) {
      T("Line Layer: layer must be used inside source tag or source prop must be set");
      return;
    }
    const o = _(), a = n(y), r = n(p), i = n(S), l = n(L), d = C(i, e.source || t);
    h([r, d], ([u, g]) => {
      u && (g || g === void 0) && (a.value.addLayer(E(e.layerId, "line", e, t), e.before || void 0), F(a.value, e.layerId, o.vnode));
    }, { immediate: !0 }), V(r, a, o, e, l);
  },
  render() {
    return b("Line Layer");
  }
}), ze = f({
  name: "MglRasterLayer",
  mixins: [B],
  props: {
    layout: Object,
    paint: Object
  },
  setup(e) {
    const t = n(M);
    if (!t && !e.source) {
      T("Raster Layer: layer must be used inside source tag or source prop must be set");
      return;
    }
    const o = _(), a = n(y), r = n(p), i = n(S), l = n(L), d = C(i, e.source || t);
    h([r, d], ([u, g]) => {
      u && (g || g === void 0) && (a.value.addLayer(E(e.layerId, "raster", e, t), e.before || void 0), F(a.value, e.layerId, o.vnode));
    }, { immediate: !0 }), V(r, a, o, e, l);
  },
  render() {
    return b("Raster Layer");
  }
}), Ne = f({
  name: "MglSymbolLayer",
  mixins: [B],
  props: {
    layout: Object,
    paint: Object
  },
  setup(e) {
    const t = n(M);
    if (!t && !e.source) {
      T("Symbol Layer: layer must be used inside source tag or source prop must be set");
      return;
    }
    const o = _(), a = n(y), r = n(p), i = n(S), l = n(L), d = C(i, e.source || t);
    h([r, d], ([u, g]) => {
      u && (g || g === void 0) && (a.value.addLayer(E(e.layerId, "symbol", e, t), e.before || void 0), F(a.value, e.layerId, o.vnode));
    }, { immediate: !0 }), V(r, a, o, e, l);
  },
  render() {
    return b("Symbol Layer");
  }
}), mt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MglMap: le,
  MglAttributionControl: ue,
  MglCustomControl: ce,
  MglFullscreenControl: de,
  MglFrameRateControl: me,
  MglGeolocationControl: he,
  MglNavigationControl: ge,
  MglScaleControl: ye,
  MglStyleSwitchControl: ve,
  MglButton: J,
  MglMarker: pe,
  MglCanvasSource: be,
  MglGeoJsonSource: Se,
  MglImageSource: Me,
  MglRasterSource: Oe,
  MglRasterDemSource: Le,
  MglVectorSource: xe,
  MglVideoSource: Ce,
  MglBackgroundLayer: we,
  MglCircleLayer: Re,
  MglFillLayer: Ie,
  MglFillExtrusionLayer: Te,
  MglHeatmapLayer: Pe,
  MglHillshadeLayer: Ae,
  MglLineLayer: _e,
  MglRasterLayer: ze,
  MglSymbolLayer: Ne
}, Symbol.toStringTag, { value: "Module" })), ke = function(t) {
  Object.entries(mt).forEach(([o, a]) => {
    t.component(o, a);
  });
}, ht = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ke,
  useMap: Ye,
  MglDefaults: m,
  usePositionWatcher: k,
  Position: z,
  MglMap: le,
  MglAttributionControl: ue,
  MglCustomControl: ce,
  MglFullscreenControl: de,
  MglFrameRateControl: me,
  MglGeolocationControl: he,
  MglNavigationControl: ge,
  MglScaleControl: ye,
  MglStyleSwitchControl: ve,
  MglButton: J,
  MglMarker: pe,
  MglCanvasSource: be,
  MglGeoJsonSource: Se,
  MglImageSource: Me,
  MglRasterSource: Oe,
  MglRasterDemSource: Le,
  MglVectorSource: xe,
  MglVideoSource: Ce,
  MglBackgroundLayer: we,
  MglCircleLayer: Re,
  MglFillLayer: Ie,
  MglFillExtrusionLayer: Te,
  MglHeatmapLayer: Pe,
  MglHillshadeLayer: Ae,
  MglLineLayer: _e,
  MglRasterLayer: ze,
  MglSymbolLayer: Ne,
  mapSymbol: y,
  isLoadedSymbol: p,
  componentIdSymbol: S,
  sourceIdSymbol: M,
  sourceLayerRegistry: L,
  emitterSymbol: P
}, Symbol.toStringTag, { value: "Module" }));
Object.entries(ht).forEach(([e, t]) => {
  if (e !== "default") {
    const o = e, a = t;
    ke[o] = a;
  }
});
export {
  ke as default
};
//# sourceMappingURL=vue-maplibre-gl.esm.js.map
