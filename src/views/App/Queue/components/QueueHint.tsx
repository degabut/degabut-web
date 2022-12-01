import { Divider } from "@components/Divider";
import { Icon, Icons } from "@components/Icon";
import { RouterLink } from "@components/Link";
import { getVideoContextMenu } from "@components/Video";
import { Videos } from "@components/Videos";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useQueueRecommendation } from "@hooks/useQueueRecommendation";
import { useNavigate } from "solid-app-router";
import { Component } from "solid-js";

type HintItemProps = {
	icon: Icons;
	href: string;
	label: string;
};

const HintItem: Component<HintItemProps> = (props) => {
	return (
		<RouterLink
			href={props.href}
			class="flex flex-row items-center w-full space-x-3 p-1.5 hover:bg-white/5 rounded"
		>
			<div class="!w-12 !h-12 flex-shrink-0 flex items-center justify-center rounded border border-neutral-500">
				<Icon name={props.icon} size="lg" extraClass="fill-neutral-500" />
			</div>
			<div class="text-neutral-400">{props.label}</div>
		</RouterLink>
	);
};

type VideoActionButtonProps = {
	icon: Icons;
	title: string;
	onClick: () => void;
};

const VideoActionButton: Component<VideoActionButtonProps> = (props) => {
	return (
		<button
			title={props.title}
			class="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded border border-neutral-500 fill-neutral-300 hover:fill-neutral-100 hover:bg-white/5"
			onClick={(ev) => {
				ev.stopImmediatePropagation();
				props.onClick();
			}}
		>
			<Icon name={props.icon} size="sm" />
		</button>
	);
};

export const QueueHint: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();
	const tracks = () => queue.data()?.tracks || [];

	const recommendation = useQueueRecommendation({ tracks });

	return (
		<div class="space-y-8 md:space-y-2">
			<div
				class="space-y-1.5"
				classList={{
					"ml-[1.35rem]": !!tracks().length,
				}}
			>
				<HintItem label="Search for a song" icon="search" href="/app/search" />
				<HintItem label="Look at recommendations" icon="heartLine" href="/app/recommendation" />
			</div>

			<div
				class="space-y-2 md:space-y-0"
				classList={{
					"md:ml-[1.35rem]": !!tracks().length,
				}}
			>
				<div class="flex-row-center space-x-3 py-2 text-sm">
					<div class="text-neutral-400">Quick Add</div>
					<Divider extraClass="flex-grow" light />
					<button
						class="flex-row-center space-x-1 text-neutral-400 hover:text-neutral-200"
						onClick={() => recommendation.reset()}
					>
						<Icon name="update" size="sm" extraClass="fill-current" />
						<div>Refresh</div>
					</button>
				</div>

				<Videos.List
					data={recommendation.randomVideos()}
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
							<div class="flex flex-row space-x-2 pl-2">
								<VideoActionButton
									title="Remove"
									onClick={() => recommendation.blacklist(video)}
									icon="closeLine"
								/>
								<VideoActionButton title="Add" onClick={() => queue.addTrack(video)} icon="plus" />
							</div>
						),
					})}
				/>
			</div>
		</div>
	);
};
