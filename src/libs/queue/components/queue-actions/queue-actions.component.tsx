import { IconSize } from "@common/components";
import { LoopMode } from "@queue/apis";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { Component, Show } from "solid-js";
import { QueueButton } from "../queue-button";

type Props = {
	extended?: boolean;
	extraClass?: string;
	extraButtonClass?: string;
	iconSize?: IconSize;
};

export const QueueActions: Component<Props> = (props) => {
	const queue = useQueue();
	const navigate = useNavigate();

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

			<Show when={props.extended}>
				<QueueButton.Lyrics
					onClick={() => navigate("/app/queue/lyrics")}
					extraClass={props.extraButtonClass}
					iconSize={props.iconSize}
				/>

				<QueueButton.Settings
					onClearQueue={queue.clear}
					onStopQueue={queue.stop}
					extraClass={props.extraButtonClass}
					iconSize={props.iconSize}
				/>
			</Show>
		</div>
	);
};
