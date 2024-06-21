import { useApp } from "@app/providers";
import { AppRoutes } from "@app/routes";
import { Button, Divider, Item, KeyboardHint, Text, useInfiniteScrolling, useNavigate, useScreen } from "@common";
import { MediaSources } from "@media-source";
import { useQueue } from "@queue";
import { type Component } from "solid-js";
import { useQueueRecommendation } from "../hooks";

export const QueueHint: Component = () => {
	const app = useApp()!;
	const screen = useScreen();
	const queue = useQueue();
	const navigate = useNavigate();
	const recommendation = useQueueRecommendation({
		queueTracks: () => queue.data.tracks || [],
	});
	let containerElement!: HTMLDivElement;

	useInfiniteScrolling({
		callback: recommendation.loadNext,
		disabled: () => recommendation.related.data.loading,
		container: () => containerElement,
	});

	return (
		<div class="space-y-6">
			<div class="space-y-2">
				<Item.Hint
					label={() => (
						<div class="flex-row-center space-x-4 truncate">
							<Text.Body1 truncate class="text-neutral-400">
								Search for a song
							</Text.Body1>
							<div class="hidden md:block">
								<KeyboardHint
									small
									combination={["Ctrl", "K"]}
									extraKbdClass="!border-neutral-500 text-neutral-300"
								/>
							</div>
						</div>
					)}
					icon="search"
					onClick={() => (screen.gte.md ? app.setIsQuickSearchModalOpen(true) : navigate(AppRoutes.Search))}
				/>
				<Item.Hint
					label={() => (
						<Text.Body1 truncate class="text-neutral-400">
							Look at recommendations
						</Text.Body1>
					)}
					icon="heartLine"
					onClick={() => navigate(AppRoutes.Recommendation)}
				/>
			</div>

			<div class="space-y-4" ref={containerElement}>
				<div class="flex-row-center justify-between space-x-2 md:space-x-4">
					<Text.Body1 class="font-medium">Recommendation</Text.Body1>
					<Divider dark />
				</div>

				<MediaSources.List
					data={recommendation.mediaSources()}
					showWhenLoading
					isLoading={recommendation.isLoading() || recommendation.related.data.loading}
					mediaSourceProps={(mediaSource) => ({
						mediaSource,
						hideContextMenuButton: true,
						right: () => (
							<Button
								flat
								tabIndex={-1}
								title="Add"
								icon="plus"
								class="shrink-0 justify-center w-10 h-10 border-neutral-500 text-neutral-400 hover:!bg-transparent"
								on:click={(ev) => {
									ev.stopImmediatePropagation();
									queue.addTrack(mediaSource);
								}}
							/>
						),
					})}
				/>
			</div>
		</div>
	);
};
