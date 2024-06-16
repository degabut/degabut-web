import { useApp } from "@app/hooks";
import { AppRoutes } from "@app/routes";
import { Container, Icon, RecapUtil, Text, useInfiniteScrolling, useNavigate } from "@common";
import { MediaSourceFactory, MediaSources } from "@media-source";
import { useQueue } from "@queue";
import { useParams } from "@solidjs/router";
import { Show, createEffect, createMemo, createSignal, type Component } from "solid-js";
import {
	ExpandableMediaSourceGrid,
	ExpandableMediaSourceList,
	RecapBanner,
	ShowMoreModal,
	ShowMoreType,
	Title,
} from "./components";
import { useRecommendation } from "./hooks";

const RecommendationEmpty: Component = () => {
	return (
		<Container size="full" extraClass="flex-col-center justify-center h-full space-y-6">
			<Icon name="heartBroken" extraClass="text-neutral-700 w-32 h-32" />
			<Text.H1>No Recommendation Found</Text.H1>
		</Container>
	);
};

export const Recommendation: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();
	const params = useParams<{ id?: string }>();
	const recommendation = useRecommendation({ userId: () => params.id || "me", onLoad: () => infinite.load() });
	const [showMoreType, setShowMoreType] = createSignal<ShowMoreType | null>(null);
	const recapYear = RecapUtil.getYear();
	let containerElement!: HTMLDivElement;

	const targetUser = createMemo(() => {
		return queue.data.voiceChannel?.members.find((m) => m.id === params.id);
	});

	const infinite = useInfiniteScrolling({
		callback: () => recommendation.loadNext(),
		disabled: () => recommendation.related().loading,
		container: () => containerElement,
	});

	createEffect(() => {
		const user = targetUser();
		app.setTitle(user ? `${user.displayName} recommendation` : "Recommendation");
	});

	return (
		<>
			<Show when={recommendation.isEmpty()}>
				<RecommendationEmpty />
			</Show>

			<Container size="xl" extraClass="space-y-4 md:space-y-8">
				{recapYear && !params.id && <RecapBanner year={recapYear} />}

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

				<div ref={containerElement}>
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
				</div>
			</Container>

			<ShowMoreModal
				isOpen={!!showMoreType()}
				initialUserId={params.id || "me"}
				type={showMoreType()}
				onClose={() => setShowMoreType(null)}
				onAddToQueue={queue.addTrack}
				onAddToQueueAndPlay={queue.addAndPlayTrack}
			/>
		</>
	);
};
