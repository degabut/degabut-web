import { onCleanup, onMount } from "solid-js";

type Params = {
	onPopState?: () => void;
};

export const useHashState = (params: Params) => {
	let currentPath = "";
	let currentHash = "";
	let windowHash = window.location.hash;

	const push = () => {
		const randomHash = "#" + Math.random().toString(36).substring(7);
		history.pushState(null, "", randomHash);
		window.dispatchEvent(new HashChangeEvent("hashchange"));
		currentPath = window.location.pathname;
		currentHash = randomHash;
	};

	const back = () => {
		setTimeout(() => {
			if (currentHash && windowHash === currentHash && currentPath === window.location.pathname) {
				history.back();
			}
		});
	};

	onMount(() => {
		window.addEventListener("popstate", onPopState);
		window.addEventListener("hashchange", onHashChange);
	});

	onCleanup(() => {
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
	});

	const onHashChange = () => {
		windowHash = location.hash;
	};

	const onPopState = () => {
		if (currentHash && currentHash === windowHash) {
			currentHash = "";
			params.onPopState?.();
		}
	};

	return { push, back };
};
