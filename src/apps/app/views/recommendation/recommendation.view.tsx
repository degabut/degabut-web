import { useApp } from "@app/hooks";
import { Container, Icon } from "@common/components";
import { useInfiniteScrolling } from "@common/hooks";
import { RecapUtil } from "@common/utils";
import { MediaSources } from "@media-source/components";
import { MediaSourceContextMenuUtil, MediaSourceFactory } from "@media-source/utils";
import { useQueue } from "@queue/hooks";
import { useNavigate, useParams } from "@solidjs/router";
import { Component, Show, createEffect, createMemo, createSignal } from "solid-js";
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
		<div class="flex-col-center w-full h-full justify-center space-y-4">
			<Icon name="heartBroken" extraClass="fill-neutral-400/10 w-32" />
			<div class="text-xl md:text-2xl text-center text-neutral-300">No Recommendation Found</div>
		</div>
	);
};

export const Recommendation: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();
	const params = useParams<{ id: string }>();
	const recommendation = useRecommendation({ userId: () => params.id || "me", onLoad: () => infinite.load() });
	const [showMoreType, setShowMoreType] = createSignal<ShowMoreType | null>(null);
	const recapYear = RecapUtil.getYear();
	let containerElement!: HTMLDivElement;

	const targetUser = createMemo(() => {
		return queue.data.voiceChannel?.members.find((m) => m.id === params.id);
	});

	const infinite = useInfiniteScrolling({
		callback: recommendation.loadNext,
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

			<Container size="xl" extraClass="space-y-8">
				{recapYear && !params.id && <RecapBanner year={recapYear} />}

				<Show when={recommendation.mostPlayed().data.length || recommendation.mostPlayed().loading}>
					<ExpandableMediaSourceGrid
						label="Most Played"
						removable
						mediaSources={recommendation.mostPlayed().data}
						isLoading={recommendation.mostPlayed().loading}
						onClickMore={() => setShowMoreType(ShowMoreType.MostPlayed)}
						onRemove={() => {
							recommendation.raw.mostPlayed.refetch();
							recommendation.raw.recentMostPlayed.refetch();
						}}
					/>
				</Show>

				<Show when={recommendation.lastPlayed().data.length || recommendation.lastPlayed().loading}>
					<ExpandableMediaSourceGrid
						label="Recently Played"
						removable
						mediaSources={recommendation.lastPlayed().data}
						isLoading={recommendation.lastPlayed().loading}
						onClickMore={() => setShowMoreType(ShowMoreType.RecentlyPlayed)}
						onRemove={() => recommendation.raw.lastPlayed.refetch()}
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
					<div ref={containerElement}>
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
									contextMenu: MediaSourceContextMenuUtil.getContextMenu({
										appStore: app,
										queueStore: queue,
										navigate,
										mediaSource,
									}),
								};
							}}
						/>
					</div>
				</Show>
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
