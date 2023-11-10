import { WindowPosterUtil } from "@common/utils";
import { Bot } from "@constants";

export class DesktopUtil {
	static authenticateRpc(clientId: string, clientSecret: string) {
		WindowPosterUtil.postMessage("authenticate-rpc", { clientId, clientSecret });
	}

	static setBotVolume(volume: number) {
		WindowPosterUtil.postMessage("set-bot-volume", volume);
	}

	// TODO remove this
	static switchBot(index: number, bot: Bot) {
		WindowPosterUtil.postMessage("bot-switched", index, bot);
	}
}
