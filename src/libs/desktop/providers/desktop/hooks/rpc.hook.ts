import { useSettings } from "@app/hooks";
import { WindowPosterUtil } from "@common/utils";

export const useRPC = () => {
	const { settings } = useSettings();

	const authenticateRpc = () => {
		if (!settings["discord.rpcClientId"] || !settings["discord.rpcClientSecret"]) return;
		WindowPosterUtil.postMessage("authenticate-rpc", {
			clientId: settings["discord.rpcClientId"],
			clientSecret: settings["discord.rpcClientSecret"],
		});
	};

	const setBotVolume = (volume: number) => {
		WindowPosterUtil.postMessage("set-bot-volume", volume);
	};

	return {
		authenticateRpc,
		setBotVolume,
	};
};
