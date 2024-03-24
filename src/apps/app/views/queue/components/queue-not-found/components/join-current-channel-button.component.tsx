import { Button, Icon, Text } from "@common/components";
import { ITextChannel, IVoiceChannelMin } from "@queue/apis";
import { useQueue } from "@queue/hooks";
import { Component } from "solid-js";

type JoinCurrentChannel = {
	onClickChannel: (voiceChannel: IVoiceChannelMin, textChannel?: ITextChannel | null) => void;
	channel: IVoiceChannelMin;
};

export const JoinCurrentChannel: Component<JoinCurrentChannel> = (props) => {
	const queue = useQueue();
	return (
		<div class="flex-row-center justify-center h-full text-neutral-300">
			<Button class="px-8 py-2.5" onClick={() => props.onClickChannel(props.channel)}>
				<div class="flex-col-center space-y-2">
					<Text.H3>Bring {queue.bot().name} to</Text.H3>
					<div class="flex-row-center space-x-2">
						<Icon size="xl" name="soundFull" class="fill-neutral-500" />
						<Text.H2>{props.channel.name}</Text.H2>
					</div>
				</div>
			</Button>
		</div>
	);
};
