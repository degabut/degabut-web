import { IconSize } from "@common/components";
import { LoopMode } from "@queue/apis";
import { useQueue } from "@queue/hooks";
import { Component, JSX } from "solid-js";
import { QueueButton } from "../queue-button";

type Props = {
	extraClass?: string;
	extraButtonClass?: string;
	iconSize?: IconSize;
	extra?: () => JSX.Element;
};

export const QueueActions: Component<Props> = (props) => {
	const queue = useQueue();

	return (
		<div class="flex-row-center" classList={{ [props.extraClass || ""]: !!props.extraClass }}>
			<QueueButton.Play
				onChange={(isPaused) => (isPaused ? queue.pause() : queue.unpause())}
				defaultValue={!!queue.data.isPaused}
				disabled={queue.freezeState.queue}
				extraClass={props.extraButtonClass}
				iconSize={props.iconSize}
			/>

			<QueueButton.Skip
				onClick={() => queue.skipTrack()}
				disabled={queue.freezeState.queue || !queue.data.nowPlaying}
				extraClass={props.extraButtonClass}
				iconSize={props.iconSize}
			/>

			<QueueButton.ShuffleToggle
				defaultValue={!!queue.data.shuffle}
				onChange={() => queue.toggleShuffle()}
				disabled={queue.freezeState.queue}
				extraClass={props.extraButtonClass}
				iconSize={props.iconSize}
			/>

			<QueueButton.LoopToggle
				defaultValue={queue.data.loopMode || LoopMode.DISABLED}
				onChange={(t) => queue.changeLoopMode(t)}
				disabled={queue.freezeState.queue}
				extraClass={props.extraButtonClass}
				iconSize={props.iconSize}
			/>

			{props.extra?.()}
		</div>
	);
};
