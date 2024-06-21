import type { IconSize } from "@common";
import type { Component, JSX } from "solid-js";
import { LoopMode } from "../../apis";
import { useQueue } from "../../providers";
import { QueueButton } from "../queue-button";

type Props = {
	extraClass?: string;
	extraButtonClass?: string;
	iconSize?: IconSize;
	extra?: () => JSX.Element;
	vertical?: boolean;
};

export const QueueActions: Component<Props> = (props) => {
	const queue = useQueue()!;

	return (
		<div
			classList={{
				[props.extraClass || ""]: !!props.extraClass,
				"flex-col-center": !!props.vertical,
				"flex-row-center": !props.vertical,
			}}
		>
			<QueueButton.ShuffleToggle
				defaultValue={!!queue.data.shuffle}
				onChange={() => queue.toggleShuffle()}
				disabled={queue.freezeState.queue}
				extraClass={props.extraButtonClass}
				iconSize={props.iconSize}
			/>

			<QueueButton.SkipPrevious
				onClick={() => queue.seek(0)}
				disabled={queue.freezeState.queue || !queue.data.nowPlaying}
				extraClass={props.extraButtonClass}
				iconSize={props.iconSize}
			/>

			<QueueButton.Play
				onChange={(isPaused) => (isPaused ? queue.pause() : queue.unpause())}
				defaultValue={!!queue.data.isPaused}
				disabled={queue.freezeState.queue}
				extraClass={props.extraButtonClass}
				iconSize={props.iconSize}
			/>

			<QueueButton.SkipNext
				onClick={() => queue.skipTrack()}
				disabled={queue.freezeState.queue || !queue.data.nowPlaying}
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
