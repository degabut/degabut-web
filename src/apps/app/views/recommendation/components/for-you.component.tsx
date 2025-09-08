import { AppRoutes } from "@app/routes";
import { Container, Icon, RecapUtil, Text, useInfiniteScrolling, useNavigate } from "@common";
import { MediaSourceFactory, MediaSources } from "@media-source";
import { useQueue } from "@queue";
import { useParams } from "@solidjs/router";
import { type Component, Show, createSignal } from "solid-js";
import { useRecommendation } from "../hooks";
import { ExpandableMediaSourceGrid, ExpandableMediaSourceList, ShowMoreType, Title } from "./";
import { RecapBanner } from "./recap-banner.component";
import { ShowMoreModal } from "./show-more-modal.component";

const RecommendationEmpty: Component = () => {
	return (
		<Container size="full" extraClass="flex-col-center justify-center h-full space-y-6">
			<Icon name="heartBroken" extraClass="text-neutral-700 w-32 h-32" />
			<Text.H1>No Recommendation Found</Text.H1>
		</Container>
	);
};

export const ForYou: Component = () => {
	const queue = useQueue()!;
	const navigate = useNavigate();
	const params = useParams<{ id?: string }>();
	const recommendation = useRecommendation({ userId: () => params.id || "me" });
	const [showMoreType, setShowMoreType] = createSignal<ShowMoreType | null>(null);
	const recapYear = RecapUtil.getYear();
	let containerElement!: HTMLDivElement;

	useInfiniteScrolling({
		callback: () => recommendation.loadNext(),
		disabled: () => recommendation.related().loading,
		container: () => containerElement,
	});

	return (
		<div class="space-y-4 md:space-y-8" ref={containerElement}>
			{recapYear && !params.id && <RecapBanner year={recapYear} />}

			<Show when={recommendation.isEmpty()}>
				<RecommendationEmpty />
			</Show>

			<Show when={recommendation.mostPlayed().data.length || recommendation.mostPlayed().loading}>
				<ExpandableMediaSourceGrid
					label="Most Played"
					removable
					mediaSources={recommendation.mostPlayed().data}
					isLoading={recommendation.mostPlayed().loading}
					onClickMore={() => setShowMoreType(ShowMoreType.MostPlayed)}
					onRemove={() => {
						recommendation.mostPlayedAction.refetch();
						recommendation.recentMostPlayedAction.refetch();
					}}
				/>
			</Show>

			<Show when={recommendation.lastLiked().data.length || recommendation.lastLiked().loading}>
				<ExpandableMediaSourceGrid
					label="Recently Liked"
					mediaSources={recommendation.lastLiked().data}
					isLoading={recommendation.lastLiked().loading}
					onClickMore={() => navigate(AppRoutes.Liked)}
				/>
			</Show>

			<Show when={recommendation.lastPlayed().data.length || recommendation.lastPlayed().loading}>
				<ExpandableMediaSourceGrid
					label="Recently Played"
					removable
					mediaSources={recommendation.lastPlayed().data}
					isLoading={recommendation.lastPlayed().loading}
					onClickMore={() => setShowMoreType(ShowMoreType.RecentlyPlayed)}
					onRemove={() => recommendation.lastPlayedAction.refetch()}
				/>
			</Show>

			<Show when={recommendation.channelRelated().data.length || recommendation.channelRelated().loading}>
				<ExpandableMediaSourceList
					label="Queue Recommendations"
					isLoading={recommendation.channelRelated().loading}
					mediaSources={recommendation.channelRelated().data}
					onClickMore={() => setShowMoreType(ShowMoreType.ChannelRelated)}
				/>
			</Show>

			<Show when={recommendation.related().data.length || recommendation.related().loading}>
				<MediaSources.List
					title={() => <Title>For You</Title>}
					isLoading={recommendation.related().loading}
					showWhenLoading
					data={recommendation.related().data}
					mediaSourceProps={(video) => {
						const mediaSource = MediaSourceFactory.fromYoutubeVideo(video);
						return {
							mediaSource,
							inQueue: queue.data.tracks?.some((t) => t.mediaSource.id === mediaSource.id),
						};
					}}
				/>
			</Show>

			<ShowMoreModal
				isOpen={!!showMoreType()}
				initialUserId={params.id || "me"}
				type={showMoreType()}
				onClose={() => setShowMoreType(null)}
				onAddToQueue={queue.addTrack}
				onAddToQueueAndPlay={queue.addAndPlayTrack}
			/>
		</div>
	);
};
