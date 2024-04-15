import type { Component } from "solid-js";
import { MediaSourcesCard } from "./components";
import { useRecommendation } from "./hooks";

export const Recommendation: Component = () => {
	const recommendation = useRecommendation();

	return (
		<div class="grid grid-cols-2 gap-2 lg:gap-4 2xl:gap-8 h-full">
			<MediaSourcesCard
				title="Most Played"
				isLoading={recommendation.mostPlayed().loading}
				mediaSources={recommendation.mostPlayed().data}
			/>
			<MediaSourcesCard
				title="Recently Played"
				isLoading={recommendation.lastPlayed().loading}
				mediaSources={recommendation.lastPlayed().data}
			/>
		</div>
	);
};
