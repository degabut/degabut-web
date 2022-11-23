import { throttle } from "@utils";
import { createSignal, onMount } from "solid-js";

export const breakpoints = {
	"3xl": 2048,
	"2xl": 1536,
	xl: 1280,
	lg: 1024,
	md: 768,
	sm: 640,
	xs: 0,
} as const;

type BreakpointKeys = keyof typeof breakpoints;
type BreakpointEntries = Record<BreakpointKeys, boolean>;
export type Screen = BreakpointEntries & {
	lte: BreakpointEntries;
	gte: BreakpointEntries;
	size: number;
	breakpoint: BreakpointKeys;
};

const breakpointEntries = Object.entries(breakpoints) as [BreakpointKeys, number][];
const breakpointsKeys = Object.keys(breakpoints) as BreakpointKeys[];
const defaultBreakpointsEntries = Object.fromEntries(breakpointsKeys.map((k) => [k, false])) as BreakpointEntries;
export const defaultScreenValue = {
	...defaultBreakpointsEntries,
	lte: defaultBreakpointsEntries,
	gte: defaultBreakpointsEntries,
	size: 0,
	breakpoint: "xs" as BreakpointKeys,
};

const fromEntries = (fn: (k: BreakpointKeys, i: number) => [BreakpointKeys, boolean]) => {
	return Object.fromEntries(breakpointsKeys.map(fn)) as BreakpointEntries;
};

export const useScreen = () => {
	const [screen, setScreen] = createSignal<Screen>(defaultScreenValue);

	const throttledResizeHandler = throttle(() => {
		const size = window.innerWidth;
		const breakpoint = (breakpointEntries.find(([, value]) => size >= value)?.[0] || "3xl") as BreakpointKeys;

		setScreen({
			size,
			breakpoint,
			...fromEntries((k, i) => [k, breakpointsKeys[i] === breakpoint]),
			lte: fromEntries((k, i) => [k, i < breakpointsKeys.findIndex((b) => b === breakpoint) || k === breakpoint]),
			gte: fromEntries((k, i) => [k, i > breakpointsKeys.findIndex((b) => b === breakpoint) || k === breakpoint]),
		});
	}, 250);

	window.addEventListener("resize", throttledResizeHandler);

	onMount(throttledResizeHandler);

	return screen;
};
