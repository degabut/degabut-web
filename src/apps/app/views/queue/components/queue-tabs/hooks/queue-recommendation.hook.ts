import { ITrack } from "@queue/apis";
import { usePlayHistory } from "@user/hooks";
import { IVideoCompact } from "@youtube/apis";
import { useVideo } from "@youtube/hooks";
import { Accessor, createEffect, createMemo, createSignal } from "solid-js";

type Params = {
	onLoad?: () => void;
	queueTracks: Accessor<ITrack[]>;
};

export const useQueueRecommendation = (params: Params) => {
	const [relatedTargetVideoIds, setRelatedTargetVideoIds] = createSignal<string[]>([]);
	const [relatedVideos, setRelatedVideos] = createSignal<IVideoCompact[]>([]);
	const currentRelatedVideoId = createMemo(() => relatedTargetVideoIds()[0]);

	const video = useVideo({ videoId: currentRelatedVideoId });
	const lastPlayedVideos = usePlayHistory({ userId: "me", last: 10 });
	const mostPlayedVideos = usePlayHistory({ userId: "me", days: 30, count: 10 });

	createEffect(() => {
		const videos = video.data()?.related;
		if (videos) {
			setRelatedVideos((c) => [...c, ...videos.filter((v) => !c.some((rv) => rv.id === v.id)).slice(0, 5)]);
			params.onLoad && setTimeout(params.onLoad, 0);
		}
	});

	createEffect(() => {
		const lastPlayed = lastPlayedVideos.data();
		const mostPlayed = mostPlayedVideos.data();
		if (!lastPlayed || !mostPlayed) return;

		const videoIds = [...mostPlayed, ...lastPlayed]
			.map((v) => v.id)
			.reduce<string[]>((acc, cur) => {
				if (!acc.includes(cur)) acc.push(cur);
				return acc;
			}, []);

		setRelatedTargetVideoIds(videoIds);
		params.onLoad && setTimeout(params.onLoad, 0);
	});

	const loadNext = () => {
		setRelatedTargetVideoIds((c) => c.slice(1));
	};

	const videos = createMemo(() => {
		const queueTracks = params.queueTracks();
		const mostPlayed = mostPlayedVideos.data() || [];
		const lastPlayed = lastPlayedVideos.data() || [];

		return [...mostPlayed, ...lastPlayed, ...relatedVideos()].reduce<IVideoCompact[]>((curr, v) => {
			if (!curr.find((cv) => cv.id === v.id) && !queueTracks.find((t) => t.video.id === v.id)) {
				curr.push(v);
			}
			return curr;
		}, []);
	});

	const isLoading = () => {
		return lastPlayedVideos.data.loading || mostPlayedVideos.data.loading;
	};

	return {
		videos,
		related: video,
		isLoading,
		loadNext,
	};
};