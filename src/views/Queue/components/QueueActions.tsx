import { LoopMode } from "@api";
import { useQueue } from "@hooks/useQueue";
import { useNavigate } from "solid-app-router";
import { Component, Show } from "solid-js";
import { LoopToggleButton } from "./LoopToggleButton";
import { LyricButton } from "./LyricButton";
import { PlayButton } from "./PlayButton";
import { SettingsButton } from "./SettingsButton";
import { ShuffleToggleButton } from "./ShuffleToggleButton";
import { SkipButton } from "./SkipButton";

type Props = {
	hideSettings?: boolean;
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

			<LyricButton onClick={() => navigate("/app/queue/lyric")} />

			<Show when={queue.data.nowPlaying && !props.hideSettings}>
				<SettingsButton onClearQueue={queue.clear} />
			</Show>
		</div>
	);
};
