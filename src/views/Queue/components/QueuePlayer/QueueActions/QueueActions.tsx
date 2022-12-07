import { LoopMode } from "@api";
import { useQueue } from "@hooks/useQueue";
import { useNavigate } from "solid-app-router";
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
};

export const QueueActions: Component<Props> = (props) => {
	const queue = useQueue();
	const navigate = useNavigate();

	return (
		<div class="flex-row-center" classList={{ [props.extraClass || ""]: !!props.extraClass }}>
			<PlayButton
				onChange={(isPaused) => (isPaused ? queue.pause() : queue.unpause())}
				defaultValue={!!queue.data.isPaused}
				disabled={queue.isQueueFreezed()}
			/>

			<SkipButton onClick={() => queue.skipTrack()} disabled={queue.isTrackFreezed() || !queue.data.nowPlaying} />

			<ShuffleToggleButton
				defaultValue={!!queue.data.shuffle}
				onChange={() => queue.toggleShuffle()}
				disabled={queue.isQueueFreezed()}
			/>

			<LoopToggleButton
				defaultValue={queue.data.loopMode || LoopMode.DISABLED}
				onChange={(t) => queue.changeLoopMode(t)}
				disabled={queue.isQueueFreezed()}
			/>

			<Show when={props.extended}>
				<LyricsButton onClick={() => navigate("/app/queue/lyrics")} />

				<SettingsButton onClearQueue={queue.clear} />
			</Show>
		</div>
	);
};
