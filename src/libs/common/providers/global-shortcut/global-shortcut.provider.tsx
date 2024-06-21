import { createContext, onCleanup, onMount, useContext, type ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";

type Modifier = {
	ctrl: boolean;
	shift: boolean;
	alt: boolean;
};

const defaultModifierValue = {
	ctrl: false,
	shift: false,
	alt: false,
};

export const GlobalShortcutContext = createContext<Modifier>({ ...defaultModifierValue });

export const GlobalShortcutProvider: ParentComponent = (props) => {
	const [modifier, setModifier] = createStore<Modifier>({ ...defaultModifierValue });

	const onKey = (e: KeyboardEvent) => {
		if (e.repeat) return;

		if (e.ctrlKey !== modifier.ctrl) setModifier("ctrl", e.ctrlKey);
		if (e.shiftKey !== modifier.shift) setModifier("shift", e.shiftKey);
		if (e.altKey !== modifier.alt) setModifier("alt", e.altKey);
	};

	onMount(() => {
		window.addEventListener("keydown", onKey);
		window.addEventListener("keyup", onKey);
	});

	onCleanup(() => {
		window.removeEventListener("keydown", onKey);
		window.removeEventListener("keyup", onKey);
	});

	return <GlobalShortcutContext.Provider value={modifier}>{props.children}</GlobalShortcutContext.Provider>;
};

export const useGlobalShortcut = () => useContext(GlobalShortcutContext);
