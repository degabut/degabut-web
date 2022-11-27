import { ITrack, IVideoCompact } from "@api";
import { Accessor, createEffect, createMemo, createSignal } from "solid-js";
import { useVideos } from "./useVideos";

type Params = {
	tracks: Accessor<ITrack[]>;
	limit?: number;
};

export const useQueueRecommendation = (params: Params) => {
	const lastPlayed = useVideos(() => ({ userId: "me", last: 20 }));
	const recentMostPlayed = useVideos(() => ({ userId: "me", days: 14, count: 20 }));
	const mostPlayed = useVideos(() => ({ userId: "me", days: 90, count: 20 }));

	const [blacklistedVideo, setBlacklistedVideo] = createSignal<IVideoCompact[]>([]);
	const [randomVideos, setRandomVideos] = createSignal<IVideoCompact[]>([]);

	const videos = createMemo(() => {
		const allVideos = [
			...(lastPlayed.data() || []),
			...(recentMostPlayed.data() || []),
			...(mostPlayed.data() || []),
		];

		const filtered = allVideos.filter((video, index, self) => {
			return (
				self.findIndex((v) => v.id === video.id) === index &&
				!params.tracks().find((track) => track.video.id === video.id) &&
				!blacklistedVideo().find((v) => v.id === video.id)
			);
		});

		return filtered;
	});

	createEffect(() => {
		const shuffled = videos().sort(() => 0.5 - Math.random());

		setRandomVideos((v) => {
			const current = v.filter((video) => shuffled.find((v) => v.id === video.id));
			const left = (params.limit || 5) - current.length;
			const videos = shuffled.filter((video) => !v.find((v) => v.id === video.id));
			return [...current, ...videos.slice(0, left)];
		});
	});

	const blacklist = (video: IVideoCompact) => {
		setRandomVideos((v) => v.filter((v) => v.id !== video.id));
		setBlacklistedVideo((v) => [...v, video]);
	};

	const reset = () => {
		setRandomVideos([]);
		setBlacklistedVideo([]);
	};

	return {
		videos,
		randomVideos,
		blacklist,
		reset,
	};
};
