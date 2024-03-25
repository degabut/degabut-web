import { Text } from "@common/components";
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
		<div class="space-y-2 h-full overflow-y-auto">
			<Text.Body1>Queue not found{queue.voiceChannelHistory.length ? ", select voice channel" : ""}</Text.Body1>

			<Show when={queue.voiceChannelHistory.length}>
				<div class="flex-col-center space-y-2">
					<For each={queue.voiceChannelHistory}>
						{(history) => <VoiceChannelList {...history} onClick={props.onClickChannel} />}
					</For>
				</div>
			</Show>
		</div>
	);
};
