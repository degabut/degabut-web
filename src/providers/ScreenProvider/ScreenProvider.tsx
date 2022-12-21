/* eslint-disable @typescript-eslint/no-explicit-any */
import { BreakpointKeys, breakpoints } from "@constants";
import { throttle } from "@utils/throttle";
import { createContext, onMount, ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";

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

export const ScreenContext = createContext<Screen>(defaultScreenValue);

export const ScreenProvider: ParentComponent = (props) => {
	const [screen, setScreen] = createStore<Screen>(defaultScreenValue);

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

	return <ScreenContext.Provider value={screen}>{props.children}</ScreenContext.Provider>;
};
