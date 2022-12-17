import { Button } from "@components/Button";
import { Divider } from "@components/Divider";
import { Icon, Icons } from "@components/Icon";
import { KeyboardHint } from "@components/KeyboardHint";
import { Text } from "@components/Text";
import { Videos } from "@components/Videos";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useQueueRecommendation } from "@hooks/useQueueRecommendation";
import { useScreen } from "@hooks/useScreen";
import { useNavigate } from "@solidjs/router";
import { getVideoContextMenu } from "@utils";
import { Component, JSX } from "solid-js";

type HintItemProps = {
	icon: Icons;
	onClick: () => void;
	label: JSX.Element;
};

const HintItem: Component<HintItemProps> = (props) => {
	return (
		<Button flat onClick={() => props.onClick()} class="flex flex-row items-center w-full space-x-3 p-1.5">
			<div class="!w-12 !h-12 shrink-0 flex items-center justify-center rounded border border-neutral-500">
				<Icon name={props.icon} size="lg" extraClass="fill-neutral-500" />
			</div>
			{props.label}
		</Button>
	);
};

export const QueueHint: Component = () => {
	const app = useApp();
	const screen = useScreen();
	const queue = useQueue();
	const navigate = useNavigate();
	const tracks = () => queue.data.tracks || [];

	const recommendation = useQueueRecommendation({ tracks });

	return (
		<div class="space-y-8 md:space-y-4">
			<div class="space-y-1.5" classList={{ "ml-[0.875rem]": !!tracks().length }}>
				<HintItem
					label={
						<div class="flex-row-center space-x-4">
							<Text.Body1 class="text-neutral-400">Search for a song</Text.Body1>
							<div class="hidden md:block">
								<KeyboardHint
									small
									combination={["Ctrl", "K"]}
									extraKbdClass="!border-neutral-500 text-neutral-300"
								/>
							</div>
						</div>
					}
					icon="search"
					onClick={() => (screen.gte.md ? app.setIsQuickSearchModalOpen(true) : navigate("/app/search"))}
				/>
				<HintItem
					label={<Text.Body1 class="text-neutral-400">Look at recommendations</Text.Body1>}
					icon="heartLine"
					onClick={() => navigate("/app/recommendation")}
				/>
			</div>

			<div class="space-y-2 md:space-y-0" classList={{ "md:ml-[0.875rem]": !!tracks().length }}>
				<div class="flex-row-center space-x-3 py-2 text-sm">
					<Text.Body2 class="shrink-0">Quick Add</Text.Body2>
					<Divider extraClass="grow" light />
					<Button
						flat
						disabled={recommendation.randomVideo.data.loading}
						onClick={() => recommendation.reset()}
						icon="update"
						iconSize="sm"
						class="space-x-2 px-2 py-1"
						classList={{
							"text-neutral-300 hover:text-neutral-100": !recommendation.randomVideo.data.loading,
							"text-neutral-500": recommendation.randomVideo.data.loading,
						}}
					>
						<Text.Body2 class="text-current">Refresh</Text.Body2>
					</Button>
				</div>

				<Videos.List
					data={[
						...recommendation.randomVideos(),
						...(recommendation.randomVideo.data()?.related?.slice(0, 3) || []),
					]}
					showWhenLoading
					isLoading={recommendation.randomVideo.data.loading || recommendation.isLoading()}
					skeletonCount={recommendation.isLoading() ? 5 : 3}
					videoProps={(video) => ({
						video,
						hideContextMenuButton: true,
						contextMenu: getVideoContextMenu({
							video,
							appStore: app,
							queueStore: queue,
							navigate,
						}),
						right: () => (
							<Button
								title="Add"
								icon="plus"
								class="shrink-0 justify-center w-10 h-10 ml-1.5 border-neutral-500 text-neutral-400"
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
