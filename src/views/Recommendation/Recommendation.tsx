import { Container } from "@components/Container";
import { Icon } from "@components/Icon";
import { Videos } from "@components/Videos";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useRecommendation } from "@hooks/useRecommendation";
import { getVideoContextMenu } from "@utils";
import { useNavigate, useParams } from "solid-app-router";
import { Component, createEffect, createMemo, createSignal, onCleanup, onMount, Show } from "solid-js";
import { ExpandableVideoList, ShowMoreModal, ShowMoreType, Title } from "./components";

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
	const recommendation = useRecommendation({ userId: () => params.id || "me", onLoad: () => attemptLoadNext() });
	const [showMoreType, setShowMoreType] = createSignal<ShowMoreType | null>(null);
	let containerElement!: HTMLDivElement;

	const targetUser = createMemo(() => {
		return queue.data.voiceChannel?.members.find((m) => m.id === params.id);
	});

	const attemptLoadNext = () => {
		if (
			!recommendation.related().loading &&
			containerElement &&
			window.innerHeight - containerElement.getBoundingClientRect().bottom > -128
		) {
			recommendation.loadNext();
		}
	};

	createEffect(() => {
		const user = targetUser();
		app.setTitle(user ? `${user.displayName} recommendation` : "For You");
	});

	onMount(() => document.addEventListener("scroll", attemptLoadNext, true));
	onCleanup(() => document.removeEventListener("scroll", attemptLoadNext, true));

	return (
		<>
			<Show when={recommendation.isEmpty()}>
				<RecommendationEmpty />
			</Show>

			<Container extraClass="space-y-12">
				<div class="grid grid-cols-1 2xl:grid-cols-2 2xl:gap-x-12 3xl:gap-x-24 gap-y-8">
					<Show when={recommendation.mostPlayed().data.length || recommendation.mostPlayed().loading}>
						<ExpandableVideoList
							label="Most Played"
							videos={recommendation.mostPlayed().data}
							isLoading={recommendation.mostPlayed().loading}
							onClickMore={() => setShowMoreType(ShowMoreType.MostPlayed)}
						/>
					</Show>

					<Show when={recommendation.lastPlayed().data.length || recommendation.lastPlayed().loading}>
						<ExpandableVideoList
							label="Recently Played"
							videos={recommendation.lastPlayed().data}
							isLoading={recommendation.lastPlayed().loading}
							onClickMore={() => setShowMoreType(ShowMoreType.RecentlyPlayed)}
						/>
					</Show>
				</div>

				<Show when={recommendation.channelRelated().data.length || recommendation.channelRelated().loading}>
					<ExpandableVideoList
						double
						label={`${queue.data.voiceChannel?.name || "Channel"} Recommendations`}
						isLoading={recommendation.channelRelated().loading}
						videos={recommendation.channelRelated().data}
						onClickMore={() => setShowMoreType(ShowMoreType.ChannelRelated)}
					/>
				</Show>

				<Show when={recommendation.related().data.length || recommendation.related().loading}>
					<div ref={containerElement}>
						<Videos.List
							label={<Title>Recommendations</Title>}
							isLoading={recommendation.related().loading}
							showWhenLoading
							data={recommendation.related().data}
							videoProps={(video) => ({
								video,
								contextMenu: getVideoContextMenu({
									appStore: app,
									queueStore: queue,
									navigate,
									video,
								}),
							})}
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
