import { Container, Icon, RecapUtil, Text, useInfiniteScrolling } from "@common";
import { useQueue } from "@queue";
import { useParams } from "@solidjs/router";
import { type Component, createSignal, For, Show } from "solid-js";
import { useTimeline } from "../hooks";
import { ExpandableMediaSourceGrid, ShowMoreModal, ShowMoreType } from "./";
import { RecapBanner } from "./recap-banner.component";

const RecommendationEmpty: Component = () => {
	return (
		<Container size="full" extraClass="flex-col-center justify-center h-full space-y-6">
			<Icon name="heartBroken" extraClass="text-neutral-700 w-32 h-32" />
			<Text.H1>No Recommendation Found</Text.H1>
		</Container>
	);
};

export const Timeline: Component = () => {
	const queue = useQueue()!;
	const params = useParams<{ id?: string }>();
	const timeline = useTimeline();
	const [showMoreMonth, setShowMoreMonth] = createSignal<string | null>(null);
	const recapYear = RecapUtil.getYear();
	let containerElement!: HTMLDivElement;

	useInfiniteScrolling({
		callback: () => timeline.loadNext(),
		disabled: () => timeline.isLoading(),
		container: () => containerElement,
	});

	return (
		<div class="space-y-4 md:space-y-8" ref={containerElement}>
			{recapYear && !params.id && <RecapBanner year={recapYear} />}

			<Show when={!timeline.isLoading() && !timeline.data().length}>
				<RecommendationEmpty />
			</Show>

			<For each={timeline.data()}>
				{(d) => (
					<ExpandableMediaSourceGrid
						label={d.month}
						removable
						mediaSources={d.data}
						isLoading={false}
						onClickMore={() => setShowMoreMonth(d.month)}
					/>
				)}
			</For>

			<Show when={timeline.isLoading()}>
				<ExpandableMediaSourceGrid label="" mediaSources={[]} isLoading={true} />
			</Show>

			<ShowMoreModal
				isOpen={!!showMoreMonth()}
				month={showMoreMonth() || ""}
				type={ShowMoreType.MonthlyMostPlayed}
				onClose={() => setShowMoreMonth(null)}
				onAddToQueue={queue.addTrack}
				onAddToQueueAndPlay={queue.addAndPlayTrack}
			/>
		</div>
	);
};
