import { IMediaSource } from "@media-source/apis";
import { usePlayHistory } from "@user/hooks";
import { createMemo } from "solid-js";

export const useRecommendation = () => {
	const lastPlayedVideos = usePlayHistory({ userId: "me", last: 30 });
	const mostPlayedVideos = usePlayHistory({ userId: "me", days: 30, count: 10 });
	const recentMostPlayedVideos = usePlayHistory({ userId: "me", days: 7, count: 10 });

	const mostPlayed = createMemo(() => {
		const allMostPlayed = [...(recentMostPlayedVideos.data() || []), ...(mostPlayedVideos.data() || [])];
		const unique = allMostPlayed.reduce<IMediaSource[]>((acc, cur) => {
			if (acc.some((v) => v.id === cur.id)) return acc;
			acc.push(cur);
			return acc;
		}, []);

		return {
			data: unique,
			loading: mostPlayedVideos.data.loading || recentMostPlayedVideos.data.loading,
		};
	});

	const lastPlayed = createMemo(() => {
		const excludedVideos = mostPlayed().data;
		const videos = lastPlayedVideos.data() || [];

		return {
			data: videos.filter((v) => !excludedVideos.some((m) => m.id === v.id)),
			loading: lastPlayedVideos.data.loading,
		};
	});

	return { lastPlayed, mostPlayed };
};
