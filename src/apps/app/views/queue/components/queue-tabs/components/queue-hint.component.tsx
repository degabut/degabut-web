import { useApp } from "@app/hooks";
import { Button, Icon, Icons, KeyboardHint, Text } from "@common/components";
import { useInfiniteScrolling, useScreen } from "@common/hooks";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { Videos } from "@youtube/components";
import { YouTubeContextMenuUtil } from "@youtube/utils";
import { Accessor, Component, JSX } from "solid-js";
import { useQueueRecommendation } from "../hooks";

type HintItemProps = {
	icon: Icons;
	onClick: () => void;
	label: Accessor<JSX.Element>;
};

const HintItem: Component<HintItemProps> = (props) => {
	return (
		<Button flat onClick={() => props.onClick()} class="flex flex-row items-center w-full space-x-3 p-1.5">
			<div class="!w-12 !h-12 shrink-0 flex items-center justify-center rounded border border-neutral-600">
				<Icon name={props.icon} size="lg" extraClass="fill-neutral-500" />
			</div>
			{props.label()}
		</Button>
	);
};

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
		<div class="space-y-8 md:space-y-4 py-2">
			<div class="space-y-2">
				<HintItem
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
					onClick={() => (screen.gte.md ? app.setIsQuickSearchModalOpen(true) : navigate("/app/search"))}
				/>
				<HintItem
					label={() => (
						<Text.Body1 truncate class="text-neutral-400">
							Look at recommendations
						</Text.Body1>
					)}
					icon="heartLine"
					onClick={() => navigate("/app/recommendation")}
				/>
			</div>

			<div class="space-y-2" ref={containerElement}>
				<Text.Body1 class="font-medium">Recommendation</Text.Body1>

				<Videos.List
					data={recommendation.videos()}
					showWhenLoading
					isLoading={recommendation.isLoading() || recommendation.related.data.loading}
					videoProps={(video) => ({
						video,
						hideContextMenuButton: true,
						contextMenu: YouTubeContextMenuUtil.getVideoContextMenu({
							video,
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
								onClick={(ev) => {
									ev.stopImmediatePropagation();
									queue.addTrack(video);
								}}
							/>
						),
					})}
				/>
			</div>
		</div>
	);
};
