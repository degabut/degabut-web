import { Card } from "@desktop-overlay/components";
import { VoiceChannelList } from "@queue/components";
import { IHistory } from "@queue/providers/queue/hooks";
import { Component, For } from "solid-js";

type VoiceChannelsCardProps = {
	voiceChannels: IHistory[];
	onClick: (voiceChannelId: string, textChannelId?: string) => void;
};

export const VoiceChannelsCard: Component<VoiceChannelsCardProps> = (props) => {
	return (
		<Card>
			<div class="w-full h-full space-y-2 overflow-y-auto">
				<For each={props.voiceChannels}>
					{(c) => <VoiceChannelList {...c} onClick={(v, t) => props.onClick(v.id, t?.id)} />}
				</For>
			</div>
		</Card>
	);
};
