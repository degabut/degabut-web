import { useUnique } from "@common";
import type { ITrack } from "@queue";
import { useLibrary } from "@user";
import { createMemo, createSignal, onMount, type Accessor } from "solid-js";

// export const useQueueRecommendation = (params: Params) => {
// 	const spotify = useSpotify();
// 	const [relatedTargetVideoIds, setRelatedTargetVideoIds] = createSignal<string[]>([]);
// 	const [relatedVideos, setRelatedVideos] = createSignal<IMediaSource[]>([]);
// 	const currentRelatedVideoId = createMemo(() => relatedTargetVideoIds()[0]);

// 	const video = useVideo({ videoId: currentRelatedVideoId });
// 	const lastPlayedVideos = usePlayHistory({ userId: "me", last: 10 });
// 	const mostPlayedVideos = usePlayHistory({ userId: "me", days: 30, count: 10 });

// 	createEffect(() => {
// 		const videos = video.data()?.related;
// 		if (videos) {
// 			setRelatedVideos((c) => [
// 				...c,
// 				...videos
// 					.filter((v) => !c.some((rv) => rv.id === v.id))
// 					.slice(0, 5)
// 					.map(MediaSourceFactory.fromYoutubeVideo),
// 			]);
// 		}
// 	});

// 	createEffect(() => {
// 		const lastPlayed = lastPlayedVideos.data();
// 		const mostPlayed = mostPlayedVideos.data();
// 		if (!lastPlayed || !mostPlayed) return;

// 		const videoIds = [...mostPlayed, ...lastPlayed]
// 			.map((v) => v.youtubeVideoId || v.playedYoutubeVideoId)
// 			.reduce<string[]>((acc, cur) => {
// 				if (cur && !acc.includes(cur)) acc.push(cur);
// 				return acc;
// 			}, []);

// 		setRelatedTargetVideoIds(videoIds);
// 	});

// 	const loadNext = () => {
// 		setRelatedTargetVideoIds((c) => c.slice(1));
// 	};

// 	const mediaSources = createMemo(() => {
// 		const queueTracks = params.queueTracks();
// 		const mostPlayed = mostPlayedVideos.data() || [];
// 		const lastPlayed = lastPlayedVideos.data() || [];
// 		const spotifyTopTracks = spotify.topTracks.data().slice(0, 5).map(MediaSourceFactory.fromSpotifyTrack);

// 		return [...spotifyTopTracks, ...mostPlayed, ...lastPlayed, ...relatedVideos()].reduce<IMediaSource[]>(
// 			(curr, v) => {
// 				if (!curr.find((cv) => cv.id === v.id) && !queueTracks.find((t) => t.mediaSource.id === v.id)) {
// 					curr.push(v);
// 				}
// 				return curr;
// 			},
// 			[]
// 		);
// 	});

// 	const isLoading = () => {
// 		return lastPlayedVideos.data.loading || mostPlayedVideos.data.loading;
// 	};

// 	return {
// 		mediaSources,
// 		related: video,
// 		isLoading,
// 		loadNext,
// 	};
// };

type Params = {
	queueTracks: Accessor<ITrack[]>;
};

export const useQueueRecommendation = (params: Params) => {
	const library = useLibrary()!;
	const [iterator, setIterator] = createSignal(1);

	onMount(() => library.load());

	const unique = useUnique({
		items: () => [
			...library.lastPlayed(),
			...library.lastLiked(),
			...library.mostPlayed(),
			...library.recentMostPlayed(),
			...library.oldMostPlayed(),
		],
		key: (item) => item.id,
	});

	const mediaSources = createMemo(() => {
		if (!iterator()) return [];

		const random = unique().sort(() => Math.random() - 0.5);

		return random.filter((item) => {
			return !params.queueTracks().some((track) => track.mediaSource.id === item.id);
		});
	});

	const isLoading = () =>
		library.oldMostPlayed.loading ||
		library.lastLiked.loading ||
		library.mostPlayed.loading ||
		library.recentMostPlayed.loading ||
		library.lastPlayed.loading;

	const reload = () => {
		library.oldMostPlayedAction.refetch();
		setIterator((v) => v + 1);
	};

	return {
		mediaSources,
		isLoading,
		reload,
	};
};
