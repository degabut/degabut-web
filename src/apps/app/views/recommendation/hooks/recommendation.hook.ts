import { IMediaSource } from "@media-source/apis";
import { useQueue } from "@queue/hooks";
import { usePlayHistory } from "@user/hooks";
import { IVideoCompact } from "@youtube/apis";
import { useVideo } from "@youtube/hooks";
import { Accessor, batch, createEffect, createMemo, createSignal } from "solid-js";

type UseRecommendationParams = {
	userId: Accessor<string>;
	onLoad?: () => void;
};

// TODO refactor
export const useRecommendation = (params: UseRecommendationParams) => {
	const queue = useQueue();
	const [relatedTargetVideoIds, setRelatedTargetVideoIds] = createSignal<string[]>([]);
	const [relatedVideos, setRelatedVideos] = createSignal<IVideoCompact[]>([]);
	const [lastPlayedParams, setLastPlayedParams] = createSignal({ userId: params.userId(), last: 20 });
	const [mostPlayedParams, setMostPlayedParams] = createSignal({ userId: params.userId(), days: 30, count: 10 });
	const [recentMostPlayedParams, setRecentMostPlayedParams] = createSignal({
		userId: params.userId(),
		days: 7,
		count: 5,
	});
	const [channelRelatedParams, setChannelRelatedParams] = createSignal({
		userId: params.userId(),
		voiceChannel: true,
		days: 14,
		count: 20,
	});
	const currentRelatedVideoId = createMemo(() => relatedTargetVideoIds()[0]);

	const video = useVideo({ videoId: currentRelatedVideoId });
	const lastPlayedVideos = usePlayHistory(lastPlayedParams);
	const mostPlayedVideos = usePlayHistory(mostPlayedParams);
	const recentMostPlayedVideos = usePlayHistory(recentMostPlayedParams);
	const channelRelatedVideos = usePlayHistory(channelRelatedParams);

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
			.map((v) => v.youtubeVideoId || v.playedYoutubeVideoId)
			.filter((v) => !!v) as string[];

		setRelatedTargetVideoIds(videoIds);
		params.onLoad && setTimeout(params.onLoad, 0);
	});

	createEffect(() => {
		const userId = params.userId();

		if (!userId) return;
		if (userId === lastPlayedParams().userId && userId === mostPlayedParams().userId) return;

		batch(() => {
			lastPlayedVideos.mutate([]);
			mostPlayedVideos.mutate([]);
			recentMostPlayedVideos.mutate([]);
			channelRelatedVideos?.mutate([]);
			setRelatedVideos([]);
			setLastPlayedParams((v) => ({ ...v, userId }));
			setMostPlayedParams((v) => ({ ...v, userId }));
			setRecentMostPlayedParams((v) => ({ ...v, userId }));
			setChannelRelatedParams((v) => ({ ...v, userId }));
		});
	});

	const loadNext = () => {
		setRelatedTargetVideoIds((c) => c.slice(1));
	};

	const mostPlayed = createMemo(() => {
		const allMostPlayed = [...(recentMostPlayedVideos.data() || []), ...(mostPlayedVideos.data() || [])];
		const unique = allMostPlayed.reduce<IMediaSource[]>((acc, cur) => {
			if (acc.some((v) => v.id === cur.id)) return acc;
			acc.push(cur);
			return acc;
		}, []);
		return {
			data: unique.slice(0, 7),
			loading: mostPlayedVideos.data.loading || recentMostPlayedVideos.data.loading,
		};
	});

	const lastPlayed = createMemo(() => {
		const excludedVideos = mostPlayed().data;
		const videos = lastPlayedVideos.data() || [];
		return {
			data: videos.filter((v) => !excludedVideos.some((m) => m.id === v.id)).slice(0, 7),
			loading: lastPlayedVideos.data.loading,
		};
	});

	const related = createMemo(() => {
		return {
			data: relatedVideos(),
			loading: video.data.loading,
		};
	});

	const channelRelated = createMemo(() => {
		if (params.userId() !== "me" || queue.data.empty) {
			return {
				data: [],
				loading: false,
			};
		}

		const excludedVideos = [...mostPlayed().data, ...lastPlayed().data];
		const videos = channelRelatedVideos.data() || [];
		return {
			data: videos.filter((v) => !excludedVideos.some((m) => m.id === v.id)).slice(0, 10),
			loading: channelRelatedVideos.data.loading,
		};
	});

	const isEmpty = createMemo(() => {
		return (
			!related().data.length &&
			!related().loading &&
			!mostPlayed().data.length &&
			!mostPlayed().loading &&
			!lastPlayed().data.length &&
			!lastPlayed().loading &&
			!channelRelated().data.length &&
			!channelRelated().loading
		);
	});

	return {
		lastPlayed,
		mostPlayed,
		related,
		channelRelated,
		loadNext,
		isEmpty,
		raw: {
			lastPlayed: lastPlayedVideos,
			mostPlayed: mostPlayedVideos,
			recentMostPlayed: recentMostPlayedVideos,
		},
	};
};
