import { useDesktop } from "@desktop/hooks";
import { useDiscord, useRichPresence } from "@discord/hooks";
import { useQueue } from "@queue/hooks";
import { createEffect } from "solid-js";

export const useAppRichPresence = () => {
	const queue = useQueue();
	const presence = useRichPresence(queue);

	const desktop = useDesktop();
	const discord = useDiscord();

	createEffect(() => {
		const a = presence();

		if (a) {
			desktop?.ipc.setActivity?.(a);
			discord?.setActivity(a);
		} else {
			desktop?.ipc.clearActivity?.();
			discord?.setActivity(null);
		}
	});
};
