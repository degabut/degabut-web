import { Divider, Text } from "@common/components";
import { ITextChannel, IVoiceChannelMin } from "@queue/apis";
import { VoiceChannelList } from "@queue/components";
import { useQueue } from "@queue/hooks";
import { Component, For, Show } from "solid-js";

type Props = {
	onClickChannel: (voiceChannel: IVoiceChannelMin, textChannel?: ITextChannel | null) => void;
};

export const VoiceChannelHistoryList: Component<Props> = (props) => {
	const queue = useQueue();

	return (
		<div class="space-y-4 h-full overflow-y-auto">
			<Text.H2>Queue Not Found</Text.H2>

			<Divider />

			<Show when={queue.voiceChannelHistory.length}>
				<Text.H3>Are you in one of these voice channels?</Text.H3>

				<div class="flex-col-center w-full space-y-3 md:max-w-lg">
					<For each={queue.voiceChannelHistory}>
						{(history) => <VoiceChannelList {...history} onClick={props.onClickChannel} />}
					</For>
				</div>
			</Show>
		</div>
	);
};
