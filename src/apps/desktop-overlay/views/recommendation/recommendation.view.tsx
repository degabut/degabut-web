import { Component } from "solid-js";
import { VideosCard } from "./components/videos-card";
import { useRecommendation } from "./hooks";

export const Recommendation: Component = () => {
	const recommendation = useRecommendation();

	return (
		<div class="grid grid-cols-2 gap-2 lg:gap-4 2xl:gap-8 h-full">
			<VideosCard
				title="Most Played"
				isLoading={recommendation.mostPlayed().loading}
				videos={recommendation.mostPlayed().data}
			/>
			<VideosCard
				title="Recently Played"
				isLoading={recommendation.lastPlayed().loading}
				videos={recommendation.lastPlayed().data}
			/>
		</div>
	);
};
