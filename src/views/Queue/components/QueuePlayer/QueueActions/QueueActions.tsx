import { LoopMode } from "@api";
import { IconSize } from "@components/Icon";
import { useQueue } from "@hooks/useQueue";
import { useNavigate } from "@solidjs/router";
import { Component, Show } from "solid-js";
import {
	LoopToggleButton,
	LyricsButton,
	PlayButton,
	SettingsButton,
	ShuffleToggleButton,
	SkipButton,
} from "./components";

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
			<PlayButton
				onChange={(isPaused) => (isPaused ? queue.pause() : queue.unpause())}
				defaultValue={!!queue.data.isPaused}
				disabled={queue.freezeState.queue}
				extraClass={props.extraButtonClass}
				iconSize={props.iconSize}
			/>

			<SkipButton
				onClick={() => queue.skipTrack()}
				disabled={queue.freezeState.queue || !queue.data.nowPlaying}
				extraClass={props.extraButtonClass}
				iconSize={props.iconSize}
			/>

			<ShuffleToggleButton
				defaultValue={!!queue.data.shuffle}
				onChange={() => queue.toggleShuffle()}
				disabled={queue.freezeState.queue}
				extraClass={props.extraButtonClass}
				iconSize={props.iconSize}
			/>

			<LoopToggleButton
				defaultValue={queue.data.loopMode || LoopMode.DISABLED}
				onChange={(t) => queue.changeLoopMode(t)}
				disabled={queue.freezeState.queue}
				extraClass={props.extraButtonClass}
				iconSize={props.iconSize}
			/>

			<Show when={props.extended}>
				<LyricsButton
					onClick={() => navigate("/app/queue/lyrics")}
					extraClass={props.extraButtonClass}
					iconSize={props.iconSize}
				/>

				<SettingsButton
					onClearQueue={queue.clear}
					extraClass={props.extraButtonClass}
					iconSize={props.iconSize}
				/>
			</Show>
		</div>
	);
};
