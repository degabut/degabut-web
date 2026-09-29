import { useApi } from "@common";
import { Bot, IS_DISCORD_EMBEDDED } from "@constants";
import { useSettings } from "@settings";
import { Accessor, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import { PlayerApi } from "../../../apis";
import { type QueueResource } from "../queue.provider";

type Params = {
	queue: QueueResource;
	bot: Accessor<Bot>;
};

const TARGET_DRIFT_SECONDS = 5;
const HARD_RESYNC_DRIFT_SECONDS = 10;
const MAX_CATCH_UP_RATE = 1.01;
const LIVE_EDGE_CHECK_INTERVAL_MS = 1000;

export const useQueuePlayerStream = (params: Params) => {
	const api = useApi();
	const playerApi = new PlayerApi(api.client);
	const { settings } = useSettings();
	const audio = new Audio();

	const isAvailable = !IS_DISCORD_EMBEDDED;
	const [isActive, setIsActive] = createSignal(false);
	const [isLoading, setIsLoading] = createSignal(false);
	const streamToken = createMemo(() => params.queue.streamToken);

	createEffect(() => {
		if (settings["botVolumes"][params.bot().id]) {
			setVolume(settings["botVolumes"][params.bot().id] / 200);
		}
	});

	const getStreamUrl = () => {
		const voiceChannelId = params.queue.voiceChannel.id;
		const streamTokenValue = streamToken();

		if (!voiceChannelId || !streamTokenValue) return null;
		return playerApi.getStreamUrl(voiceChannelId, streamTokenValue);
	};

	const play = async () => {
		const url = getStreamUrl();
		if (!url) return;

		setIsLoading(true);
		audio.src = url;
		try {
			await audio.play();
			setIsActive(true);
		} catch (error) {
			setIsActive(false);
			if (error instanceof DOMException && error.name === "NotAllowedError") return;
			console.error("Error playing audio:", error);
		}
		setIsLoading(false);
	};

	const syncToLiveEdge = () => {
		if (audio.paused || audio.seeking) return;

		const { buffered } = audio;
		if (!buffered.length) return;

		const edge = buffered.end(buffered.length - 1);
		const drift = edge - audio.currentTime;

		if (drift < TARGET_DRIFT_SECONDS) {
			if (audio.playbackRate !== 1) audio.playbackRate = 1;
			return;
		}

		if (drift >= HARD_RESYNC_DRIFT_SECONDS) {
			audio.playbackRate = 1;
			audio.currentTime = edge - TARGET_DRIFT_SECONDS;
			return;
		}

		audio.playbackRate = MAX_CATCH_UP_RATE;
	};

	const liveEdgeTimer = setInterval(syncToLiveEdge, LIVE_EDGE_CHECK_INTERVAL_MS);

	audio.addEventListener("ended", async () => {
		// attempt reconnect after 3 seconds;
		if (!isActive()) return;
		await new Promise((resolve) => setTimeout(resolve, 3000));
		void play();
	});

	audio.addEventListener("error", () => {
		const error = audio.error;
		if (error) console.error(error.code, error.message);
	});

	const stop = () => {
		audio.playbackRate = 1;
		audio.pause();
		audio.removeAttribute("src");
		audio.load();
		setIsActive(false);
	};

	const setVolume = (volume: number) => {
		audio.volume = volume;
	};

	onCleanup(() => {
		clearInterval(liveEdgeTimer);
		stop();
	});

	createEffect(() => {
		if (params.queue.empty) stop();
	});

	return { play, stop, setVolume, isActive, isLoading, isAvailable };
};
