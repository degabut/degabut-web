import { RICH_PRESENCE_CLIENT_ID } from "@constants";
import type { IRichPresenceAsset } from "@discord";
import axios from "axios";
import { createSignal, onMount } from "solid-js";

export const useAssets = () => {
	const [assets, setAssets] = createSignal<IRichPresenceAsset[]>([]);

	onMount(async () => {
		const appId = RICH_PRESENCE_CLIENT_ID;
		const response = await axios.get(`https://discord.com/api/v9/oauth2/applications/${appId}/assets`);

		setAssets(
			response.data.map((asset: IRichPresenceAsset) => ({
				id: asset.id,
				name: asset.name,
				url: `https://cdn.discordapp.com/app-assets/${appId}/${asset.id}`,
			}))
		);
	});

	return assets;
};
