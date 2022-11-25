import { LoopType } from "@api";
import { useQueue } from "@hooks/useQueue";
import { Component, Show } from "solid-js";
import { LoopToggleButton } from "./LoopToggleButton";
import { SettingsButton } from "./SettingsButton";
import { ShuffleToggleButton } from "./ShuffleToggleButton";
import { SkipButton } from "./SkipButton";

type Props = {
	hideSettings?: boolean;
	extraClass?: string;
};

export const QueueActions: Component<Props> = (props) => {
	const queue = useQueue();

	return (
		<div class={`flex-row-center justify-evenly space-x-4 ${props.extraClass}`}>
			<SkipButton
				onClick={() => queue.skipTrack()}
				disabled={queue.isTrackFreezed() || !queue.data()?.nowPlaying}
			/>
			<ShuffleToggleButton
				defaultValue={!!queue.data()?.shuffle}
				onChange={() => queue.toggleShuffle()}
				disabled={queue.isQueueFreezed()}
			/>
			<LoopToggleButton
				defaultValue={queue.data()?.loopType || LoopType.DISABLED}
				onChange={(t) => queue.changeLoopType(t)}
				disabled={queue.isQueueFreezed()}
			/>
			<Show when={queue.data()?.nowPlaying && !props.hideSettings}>
				<SettingsButton onClearQueue={queue.clear} />
			</Show>
		</div>
	);
};
