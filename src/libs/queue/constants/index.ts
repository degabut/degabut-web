import { LoopMode } from "../apis";
import { type QueueResource } from "../providers";

export const defaultQueue: QueueResource = {
	guild: { icon: null, id: "", name: "" },
	history: [],
	isPaused: false,
	loopMode: LoopMode.DISABLED,
	nowPlaying: null,
	nextTrackIds: [],
	position: 0,
	shuffle: false,
	autoplay: false,
	autoplayOptions: {
		types: [],
		maxDuration: null,
		minDuration: null,
	},
	textChannel: null,
	tracks: [],
	voiceChannel: { id: "", name: "", members: [] },
	filtersState: {
		equalizer: {
			enabled: false,
			bands: Array.from({ length: 15 }, (_, i) => ({ band: i, gain: 0 })),
		},
		timescale: { enabled: false, speed: 1, pitch: 1, rate: 1 },
		tremolo: { enabled: false, frequency: 2.5, depth: 0.5 },
		vibrato: { enabled: false, frequency: 2.5, depth: 0.5 },
		rotation: { enabled: false, rotationHz: 0.5 },
	},
	filters: {},
	empty: true,
};
