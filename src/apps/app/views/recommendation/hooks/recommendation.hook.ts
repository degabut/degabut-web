import { useApi } from "@common";
import { useQueue } from "@queue";
import { UserApi } from "@user";
import { useVideo, type IVideoCompact } from "@youtube";
import { batch, createEffect, createMemo, createResource, createSignal, on, type Accessor } from "solid-js";

type UseRecommendationParams = {
	userId: Accessor<string>;
	onLoad?: () => void;
};

type ProcessorOptions<T> = {
	data: T[];
	loading: boolean;
	exclude?: T[];
	identifier?: keyof T;
	limit: number;
};

const processData = <T = unknown>(options: ProcessorOptions<T>) => {
	const identifier = options.identifier || ("id" as keyof T);

	const unique = options.data.reduce<T[]>((acc, cur) => {
		if (
			acc.some((v) => v[identifier] === cur[identifier]) ||
			(options.exclude && options.exclude.some((v) => v[identifier] === cur[identifier]))
		) {
			return acc;
		}

		acc.push(cur);
		return acc;
	}, []);

	return {
		data: unique.slice(0, options.limit),
		loading: options.loading,
	};
};

export const useRecommendation = (params: UseRecommendationParams) => {
	const queue = useQueue();
	const api = useApi();
	const user = new UserApi(api.client);

	const [lastPlayedData, lastPlayedAction] = createResource(
		params.userId,
		(userId) => {
			const params = { last: 20 };
			if (userId === "me") return user.getPlayHistory(params);
			return user.getUserPlayHistory(userId, params);
		},
		{ initialValue: [] }
	);

	const [recentMostPlayedData, recentMostPlayedAction] = createResource(
		params.userId,
		(userId) => {
			const params = { days: 14, count: 10 };
			if (userId === "me") return user.getPlayHistory(params);
			return user.getUserPlayHistory(userId, params);
		},
		{ initialValue: [] }
	);

	const [mostPlayedData, mostPlayedAction] = createResource(
		params.userId,
		(userId) => {
			const params = { days: 30, count: 10 };
			if (userId === "me") return user.getPlayHistory(params);
			return user.getUserPlayHistory(userId, params);
		},
		{ initialValue: [] }
	);

	const [lastLikedData, lastLikedAction] = createResource(
		params.userId,
		(userId) => {
			if (userId === "me") return user.getLikedMediaSource(1, 10);
			return [];
		},
		{ initialValue: [] }
	);

	const [channelRelatedData, channelRelatedAction] = createResource(
		queue.data.empty,
		(isEmpty) => {
			if (isEmpty) return [];
			const params = { voiceChannel: true, days: 14, count: 20 };
			return user.getPlayHistory(params);
		},
		{ initialValue: [] }
	);

	const [relatedTargetVideoIds, setRelatedTargetVideoIds] = createSignal<string[]>([]);
	const [relatedVideos, setRelatedVideos] = createSignal<IVideoCompact[]>([]);
	const currentRelatedVideoId = createMemo(() => relatedTargetVideoIds()[0]);
	const video = useVideo({ videoId: currentRelatedVideoId });

	createEffect(() => {
		const videos = video.data()?.related;
		if (videos) {
			setRelatedVideos((c) => [...c, ...videos.filter((v) => !c.some((rv) => rv.id === v.id)).slice(0, 5)]);
			params.onLoad && setTimeout(params.onLoad, 0);
		}
	});

	createEffect(
		on([() => mostPlayed(), () => lastPlayed()], ([mostPlayed, lastPlayed]) => {
			if (mostPlayed.loading || lastPlayed.loading) return;

			const ids = [
				...new Set(
					[...mostPlayed.data, ...lastPlayed.data].map((v) => v.youtubeVideoId || v.playedYoutubeVideoId)
				),
			].filter((id) => id) as string[];

			setRelatedTargetVideoIds(ids);
		})
	);

	createEffect(
		on(params.userId, () => {
			batch(() => {
				lastPlayedAction.mutate([]);
				lastLikedAction.mutate([]);
				mostPlayedAction.mutate([]);
				recentMostPlayedAction.mutate([]);
				channelRelatedAction.mutate([]);
				setRelatedVideos([]);
				setRelatedTargetVideoIds([]);
			});
		})
	);

	const loadNext = () => {
		setRelatedTargetVideoIds((c) => c.slice(1));
	};

	const mostPlayed = createMemo(() => {
		return processData({
			data: [...recentMostPlayedData(), ...mostPlayedData()],
			loading: mostPlayedData.loading || recentMostPlayedData.loading,
			limit: 7,
		});
	});

	const lastPlayed = createMemo(() => {
		return processData({
			data: lastPlayedData(),
			exclude: mostPlayed().data,
			loading: lastPlayedData.loading,
			limit: 7,
		});
	});

	const channelRelated = createMemo(() => {
		return processData({
			data: channelRelatedData(),
			exclude: [...mostPlayed().data, ...lastPlayed().data],
			loading: channelRelatedData.loading,
			limit: 10,
		});
	});

	const lastLiked = createMemo(() => {
		return {
			data: lastLikedData().map((d) => d.mediaSource),
			loading: lastLikedData.loading,
		};
	});

	const related = createMemo(() => {
		return {
			data: relatedVideos(),
			loading: video.data.loading,
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
		lastLiked,
		lastPlayedAction,
		mostPlayedAction,
		recentMostPlayedAction,
		related,
		channelRelated,
		loadNext,
		isEmpty,
	};
};
