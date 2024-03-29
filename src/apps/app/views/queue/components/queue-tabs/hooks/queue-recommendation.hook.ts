import { IMediaSource } from "@media-source/apis";
import { MediaSourceFactory } from "@media-source/utils";
import { ITrack } from "@queue/apis";
import { useSpotify } from "@spotify/hooks";
import { usePlayHistory } from "@user/hooks";
import { useVideo } from "@youtube/hooks";
import { Accessor, createEffect, createMemo, createSignal } from "solid-js";

type Params = {
	onLoad?: () => void;
	queueTracks: Accessor<ITrack[]>;
};

export const useQueueRecommendation = (params: Params) => {
	const spotify = useSpotify();
	const [relatedTargetVideoIds, setRelatedTargetVideoIds] = createSignal<string[]>([]);
	const [relatedVideos, setRelatedVideos] = createSignal<IMediaSource[]>([]);
	const currentRelatedVideoId = createMemo(() => relatedTargetVideoIds()[0]);

	const video = useVideo({ videoId: currentRelatedVideoId });
	const lastPlayedVideos = usePlayHistory({ userId: "me", last: 10 });
	const mostPlayedVideos = usePlayHistory({ userId: "me", days: 30, count: 10 });

	createEffect(() => {
		const videos = video.data()?.related;
		if (videos) {
			setRelatedVideos((c) => [
				...c,
				...videos
					.filter((v) => !c.some((rv) => rv.id === v.id))
					.slice(0, 5)
					.map(MediaSourceFactory.fromYoutubeVideo),
			]);
			params.onLoad && setTimeout(params.onLoad, 0);
		}
	});

	createEffect(() => {
		const lastPlayed = lastPlayedVideos.data();
		const mostPlayed = mostPlayedVideos.data();
		if (!lastPlayed || !mostPlayed) return;

		const videoIds = [...mostPlayed, ...lastPlayed]
			.map((v) => v.youtubeVideoId || v.playedYoutubeVideoId)
			.reduce<string[]>((acc, cur) => {
				if (cur && !acc.includes(cur)) acc.push(cur);
				return acc;
			}, []);

		setRelatedTargetVideoIds(videoIds);
		params.onLoad && setTimeout(params.onLoad, 0);
	});

	const loadNext = () => {
		setRelatedTargetVideoIds((c) => c.slice(1));
	};

	const mediaSources = createMemo(() => {
		const queueTracks = params.queueTracks();
		const mostPlayed = mostPlayedVideos.data() || [];
		const lastPlayed = lastPlayedVideos.data() || [];
		const spotifyTopTracks = spotify.topTracks.data().slice(0, 5).map(MediaSourceFactory.fromSpotifyTrack);

		return [...spotifyTopTracks, ...mostPlayed, ...lastPlayed, ...relatedVideos()].reduce<IMediaSource[]>(
			(curr, v) => {
				if (!curr.find((cv) => cv.id === v.id) && !queueTracks.find((t) => t.mediaSource.id === v.id)) {
					curr.push(v);
				}
				return curr;
			},
			[]
		);
	});

	const isLoading = () => {
		return lastPlayedVideos.data.loading || mostPlayedVideos.data.loading;
	};

	return {
		mediaSources,
		related: video,
		isLoading,
		loadNext,
	};
};
