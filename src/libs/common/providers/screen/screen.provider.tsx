import { DelayUtil } from "@common/utils";
import { BreakpointKeys, breakpoints } from "@constants";
import { ParentComponent, createContext, createEffect, on, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";

type BreakpointEntries = Record<BreakpointKeys, boolean>;
export type Screen = BreakpointEntries & {
	gte: BreakpointEntries;
	size: number;
	breakpoint: BreakpointKeys;
};

const breakpointEntries = Object.entries(breakpoints) as [BreakpointKeys, number][];
const breakpointsKeys = Object.keys(breakpoints) as BreakpointKeys[];
const defaultBreakpointsEntries = Object.fromEntries(breakpointsKeys.map((k) => [k, false])) as BreakpointEntries;
export const defaultScreenValue = {
	...defaultBreakpointsEntries,
	gte: { ...defaultBreakpointsEntries },
	size: 0,
	breakpoint: "xs" as BreakpointKeys,
};

export const ScreenContext = createContext<Screen>(defaultScreenValue);

export const ScreenProvider: ParentComponent = (props) => {
	const [screen, setScreen] = createStore<Screen>({ ...defaultScreenValue });

	const throttledResizeHandler = DelayUtil.throttle(() => {
		const size = window.innerWidth;
		setScreen("size", size);

		const breakpoint = (breakpointEntries.find(([, value]) => size >= value)?.[0] || "3xl") as BreakpointKeys;
		if (breakpoint !== screen.breakpoint) setScreen("breakpoint", breakpoint);
	}, 250);

	createEffect(
		on(
			() => screen.breakpoint,
			() => {
				const size = screen.size;
				for (const [key, value] of breakpointEntries) {
					if (size >= value && !screen[key]) setScreen(key, true);
					else if (screen[key]) setScreen(key, false);

					if (size >= value && !screen.gte[key]) setScreen("gte", key, true);
					else if (size < value && screen.gte[key]) setScreen("gte", key, false);
				}
			}
		)
	);

	onMount(() => {
		throttledResizeHandler();
		window.addEventListener("resize", throttledResizeHandler);
	});

	onCleanup(() => {
		window.removeEventListener("resize", throttledResizeHandler);
	});

	return <ScreenContext.Provider value={screen}>{props.children}</ScreenContext.Provider>;
};
