import { useApp } from "@app/hooks";
import { Button, Item, KeyboardHint, Text } from "@common/components";
import { useInfiniteScrolling, useScreen } from "@common/hooks";
import { MediaSources } from "@media-source/components";
import { MediaSourceContextMenuUtil } from "@media-source/utils";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { Component } from "solid-js";
import { useQueueRecommendation } from "../hooks";

export const QueueHint: Component = () => {
	const app = useApp();
	const screen = useScreen();
	const queue = useQueue();
	const navigate = useNavigate();
	const recommendation = useQueueRecommendation({
		onLoad: () => infinite.load(),
		queueTracks: () => queue.data.tracks || [],
	});
	let containerElement!: HTMLDivElement;

	const infinite = useInfiniteScrolling({
		callback: recommendation.loadNext,
		disabled: () => recommendation.related.data.loading,
		container: () => containerElement,
	});

	return (
		<div class="space-y-6 md:space-y-4">
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
					onClick={() => (screen.gte.md ? app.setIsQuickSearchModalOpen(true) : navigate("/search"))}
				/>
				<Item.Hint
					label={() => (
						<Text.Body1 truncate class="text-neutral-400">
							Look at recommendations
						</Text.Body1>
					)}
					icon="heartLine"
					onClick={() => navigate("/recommendation")}
				/>
			</div>

			<div class="space-y-2" ref={containerElement}>
				<Text.Body1 class="font-medium">Recommendation</Text.Body1>

				<MediaSources.List
					data={recommendation.mediaSources()}
					showWhenLoading
					isLoading={recommendation.isLoading() || recommendation.related.data.loading}
					mediaSourceProps={(mediaSource) => ({
						mediaSource,
						hideContextMenuButton: true,
						contextMenu: MediaSourceContextMenuUtil.getContextMenu({
							mediaSource,
							appStore: app,
							queueStore: queue,
							navigate,
						}),
						right: () => (
							<Button
								flat
								title="Add"
								icon="plus"
								class="shrink-0 justify-center w-10 h-10 ml-1.5 border-neutral-500 text-neutral-400 hover:!bg-transparent"
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
