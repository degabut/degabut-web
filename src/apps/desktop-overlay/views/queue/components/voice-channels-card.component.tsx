import { Card } from "@desktop-overlay/components";
import { VoiceChannelList, useQueue } from "@queue";
import { For, type Component } from "solid-js";

export const VoiceChannelsCard: Component = () => {
	const queue = useQueue();

	return (
		<Card>
			<div class="w-full h-full space-y-2 overflow-y-auto">
				<For each={queue.voiceChannelHistory.history}>
					{(c) => (
						<VoiceChannelList
							{...c}
							onClick={(v, t) => queue.join(v.id, t?.id)}
							onClickRemove={(v, t) => queue.voiceChannelHistory.deleteHistory(v.id, t?.id)}
						/>
					)}
				</For>
			</div>
		</Card>
	);
};
