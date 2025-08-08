import { useApp } from "@app/providers";
import { AppRoutes } from "@app/routes";
import { Button, Divider, Item, KeyboardHint, Text, useNavigate, useScreen } from "@common";
import { MediaSources } from "@media-source";
import { useQueue } from "@queue";
import { type Component } from "solid-js";
import { useQueueRecommendation } from "../hooks";

export const QueueHint: Component = () => {
	const app = useApp()!;
	const screen = useScreen();
	const queue = useQueue()!;
	const navigate = useNavigate();
	const recommendation = useQueueRecommendation({
		queueTracks: () => queue.data.tracks || [],
	});
	let containerElement!: HTMLDivElement;

	// useInfiniteScrolling({
	// 	callback: recommendation.loadNext,
	// 	disabled: () => recommendation.related.data.loading,
	// 	container: () => containerElement,
	// });

	return (
		<div class="space-y-2">
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
			</div>

			<div class="space-y-2.5" ref={containerElement}>
				<div class="flex-row-center justify-between space-x-2 md:space-x-4 sticky py-4 -top-4 left-0 bg-neutral-950 z-10">
					<Text.Body1 class="font-medium">Recommendations</Text.Body1>
					<Divider dark />
					<Button
						flat
						theme="secondary"
						icon="reload"
						iconSize="md"
						class="p-1.5 space-x-2.5"
						onClick={recommendation.reload}
						disabled={recommendation.isLoading()}
					/>
				</div>

				<MediaSources.List
					data={recommendation.mediaSources()}
					isLoading={recommendation.isLoading()}
					mediaSourceProps={(mediaSource) => ({
						mediaSource,
						hideContextMenuButton: !screen.gte.md,
						right: !screen.gte.md
							? () => (
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
							  )
							: undefined,
					})}
				/>
			</div>
		</div>
	);
};
