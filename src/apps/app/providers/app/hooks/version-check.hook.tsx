import { APP_VERSION } from "@constants";
import axios from "axios";
import { createSignal, onCleanup, onMount } from "solid-js";

export const useVersionCheck = () => {
	let fetchInterval: NodeJS.Timeout | null = null;
	const currentVersion = APP_VERSION;
	const [hasNewVersion, setHasNewVersion] = createSignal(false);

	onMount(() => {
		fetchVersion();

		fetchInterval = setInterval(() => {
			fetchVersion();
		}, 1000 * 60 * 3);
	});

	onCleanup(() => {
		if (fetchInterval) clearInterval(fetchInterval);
	});

	const fetchVersion = async () => {
		const response = await axios.get("/app.json");
		const { version } = response.data;

		if (currentVersion && currentVersion !== version) {
			setHasNewVersion(true);
			if (fetchInterval) clearInterval(fetchInterval);
		}
	};

	return { hasNewVersion };
};
