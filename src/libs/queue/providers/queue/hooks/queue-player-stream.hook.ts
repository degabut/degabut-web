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
const HEALTH_CHECK_INTERVAL_MS = 1000;
const RECONNECT_DELAY_MS = 3000;
const DRIFT_SMOOTHING = 0.1;
const DRIFT_NOTIFY_EPSILON_SECONDS = 0.25;

export const useQueuePlayerStream = (params: Params) => {
	const api = useApi();
	const playerApi = new PlayerApi(api.client);
	const { settings } = useSettings();
	const audio = new Audio();

	let reconnectTimer: number | undefined;
	let liveEdgeInterval: number | undefined;
	let healthCheckInterval: number | undefined;
	let smoothedDrift: number | null = null;
	let lastAudioTime: number | null = null;
	let lastAudioTimeCheck: number | null = null;
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
		stop();

		const url = getStreamUrl();
		if (!url) return;

		console.info("Playing Audio Stream");

		setIsLoading(true);
		audio.src = url;

		liveEdgeInterval = window.setInterval(syncToLiveEdge, LIVE_EDGE_CHECK_INTERVAL_MS);

		try {
			await audio.play();
			healthCheckInterval = window.setInterval(healthCheck, HEALTH_CHECK_INTERVAL_MS);
			setIsActive(true);
		} catch (error) {
			setIsActive(false);
			if (error instanceof DOMException && error.name === "NotAllowedError") return;
			console.error("Error playing audio:", error);
			scheduleReconnect();
		} finally {
			setIsLoading(false);
		}
	};

	const stop = () => {
		cleanUp();
		setIsActive(false);
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

	const healthCheck = () => {
		if (!isActive() || isLoading() || !params.queue.nowPlaying || params.queue.isPaused) return;

		const now = Date.now();
		if (lastAudioTime !== null && audio.currentTime === lastAudioTime && now - lastAudioTimeCheck! >= 3000) {
			console.error("Audio stream stalled, attempting to reconnect");
			play();
		}
		if (lastAudioTime !== null && audio.currentTime !== lastAudioTime) lastAudioTimeCheck = now;
		lastAudioTime = audio.currentTime;
	};

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

	audio.addEventListener("ended", () => {
		console.info("Audio stream ended");
		scheduleReconnect();
	});

	const cleanUp = () => {
		audio.playbackRate = 1;
		audio.pause();
		audio.removeAttribute("src");
		audio.load();
		smoothedDrift = null;
		lastAudioTime = null;
		lastAudioTimeCheck = null;
		clearInterval(healthCheckInterval);
		clearInterval(liveEdgeInterval);
		clearTimeout(reconnectTimer);
		setDriftSeconds(0);
	};

	const setVolume = (perceptual: number) => {
		// convert perceptual volume to amplitude
		// credit: https://github.com/discord/perceptual

		const normalizedMax = 1;
		const range = 50;
		const boostRange = 6;

		if (perceptual === 0) {
			return 0;
		}
		let db;
		if (perceptual > normalizedMax) {
			db = ((perceptual - normalizedMax) / normalizedMax) * boostRange;
		} else {
			db = (perceptual / normalizedMax) * range - range;
		}
		const actual = normalizedMax * Math.pow(10, db / 20);

		audio.volume = actual;
	};

	const position = () => {
		if (!isActive()) return 0;

		const timescale = params.queue.filtersState.timescale;
		const speed = timescale.enabled ? (timescale.speed || 1) * (timescale.rate || 1) : 1;

		return Math.max(0, params.queue.position - driftSeconds() * 1000 * speed);
	};

	onCleanup(() => stop());

	createEffect(() => {
		if (params.queue.empty) stop();
	});

	return { play, stop, setVolume, position, isActive, isLoading, isAvailable };
};
