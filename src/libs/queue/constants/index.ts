import { LoopMode } from "../apis";
import { type QueueResource } from "../providers";

export const defaultQueue: QueueResource = {
	guild: { icon: null, id: "", name: "" },
	history: [],
	isPaused: false,
	loopMode: LoopMode.DISABLED,
	nowPlaying: null,
	position: 0,
	shuffle: false,
	textChannel: null,
	tracks: [],
	voiceChannel: { id: "", name: "", members: [] },
	empty: true,
};
