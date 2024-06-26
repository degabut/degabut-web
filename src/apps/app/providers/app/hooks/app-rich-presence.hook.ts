import { useDesktop } from "@desktop";
import { useDiscord, useRichPresence } from "@discord";
import { useQueue } from "@queue";
import { useSettings } from "@settings";
import { createEffect } from "solid-js";

export const useAppRichPresence = () => {
	const queue = useQueue()!;
	const { settings } = useSettings();

	const presence = useRichPresence({
		enabled: () => settings["discord.richPresence"],
		idleTemplate: () => settings["discord.richPresence.idleTemplate"],
		template: () => settings["discord.richPresence.template"],
		queueContext: queue,
	});

	const desktop = useDesktop();
	const discord = useDiscord();

	createEffect(() => {
		const a = presence();

		if (a) {
			desktop?.ipc.send?.("set-activity", a);
			discord?.setActivity(a);
		} else if (!settings["discord.richPresence"]) {
			desktop?.ipc.send?.("clear-activity");
			discord?.setActivity(null);
		}
	});
};
