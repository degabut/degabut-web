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
const RECONNECT_DELAY_MS = 3000;
const DRIFT_SMOOTHING = 0.1;
const DRIFT_NOTIFY_EPSILON_SECONDS = 0.25;

export const useQueuePlayerStream = (params: Params) => {
	const api = useApi();
	const playerApi = new PlayerApi(api.client);
	const { settings } = useSettings();
	const audio = new Audio();

	let reconnectTimer: number | undefined;
	let smoothedDrift: number | null = null;
	const isAvailable = !IS_DISCORD_EMBEDDED;
	const [isActive, setIsActive] = createSignal(false);
	const [isLoading, setIsLoading] = createSignal(false);
	const [driftSeconds, setDriftSeconds] = createSignal(0, {
		equals: (prev, next) => Math.abs(next - prev) < DRIFT_NOTIFY_EPSILON_SECONDS,
	});
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
		const seconds = edge - audio.currentTime;

		smoothedDrift = smoothedDrift === null ? seconds : smoothedDrift + (seconds - smoothedDrift) * DRIFT_SMOOTHING;
		setDriftSeconds(smoothedDrift);

		if (seconds < TARGET_DRIFT_SECONDS) {
			if (audio.playbackRate !== 1) audio.playbackRate = 1;
			return;
		}

		if (seconds >= HARD_RESYNC_DRIFT_SECONDS) {
			audio.playbackRate = 1;
			audio.currentTime = edge - TARGET_DRIFT_SECONDS;
			// The seek just set the lag to the target, so restart the average from there.
			smoothedDrift = TARGET_DRIFT_SECONDS;
			setDriftSeconds(TARGET_DRIFT_SECONDS);
			return;
		}

		audio.playbackRate = MAX_CATCH_UP_RATE;
	};

	const liveEdgeTimer = setInterval(syncToLiveEdge, LIVE_EDGE_CHECK_INTERVAL_MS);

	const scheduleReconnect = () => {
		if (!isActive() || reconnectTimer !== undefined) return;
		reconnectTimer = window.setTimeout(() => {
			reconnectTimer = undefined;
			void play();
		}, RECONNECT_DELAY_MS);
	};

	audio.addEventListener("error", () => {
		const error = audio.error;
		if (!error || error.code === 1) return;
		console.error(`Error playing audio: ${error.message}`);
		scheduleReconnect();
	});

	audio.addEventListener("ended", () => scheduleReconnect());

	const stop = () => {
		audio.playbackRate = 1;
		audio.pause();
		audio.removeAttribute("src");
		audio.load();
		clearTimeout(reconnectTimer);
		smoothedDrift = null;
		setDriftSeconds(0);
		setIsActive(false);
	};

	const setVolume = (volume: number) => {
		audio.volume = volume;
	};

	const position = () => {
		if (!isActive()) return 0;

		const timescale = params.queue.filtersState.timescale;
		const speed = timescale.enabled ? (timescale.speed || 1) * (timescale.rate || 1) : 1;

		return Math.max(0, params.queue.position - driftSeconds() * 1000 * speed);
	};

	onCleanup(() => {
		clearInterval(liveEdgeTimer);
		stop();
	});

	createEffect(() => {
		if (params.queue.empty) stop();
	});

	return { play, stop, setVolume, position, isActive, isLoading, isAvailable };
};
