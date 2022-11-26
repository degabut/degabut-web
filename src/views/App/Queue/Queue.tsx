import { Container } from "@components/Container";
import { Icon } from "@components/Icon";
import { RouterLink } from "@components/Link";
import { TabLabel, Tabs } from "@components/Tabs";
import { getVideoContextMenu, Video } from "@components/Video";
import { Videos } from "@components/Videos";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useNavigate } from "solid-app-router";
import { Component, onMount, Show } from "solid-js";
import { QueueActions, QueuePlayHistory, QueueTrackList } from "./components";

const QueueNotFound: Component = () => {
	return (
		<div class="flex-col-center w-full h-full justify-center space-y-4">
			<Icon name="musicOff" extraClass="fill-neutral-400/10" />
			<div class="text-xl md:text-2xl text-center text-neutral-300">No Queue Found</div>
		</div>
	);
};

const EmptyNowPlaying: Component = () => {
	return (
		<RouterLink
			href="/app/recommendation"
			class="flex flex-row items-center space-x-4 md:p-1.5 outline outline-1 outline-neutral-700 rounded hover:bg-white/[2.5%]"
		>
			<div class="!w-16 !h-16 rounded border border-neutral-600" />
			<div class="text-neutral-400">It's lonely here...</div>
		</RouterLink>
	);
};

const QueueView: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	return (
		<Container extraClass="space-y-4 md:space-y-6">
			<div class="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
				<div class="flex-grow">
					<Show when={queue.data()?.nowPlaying} keyed fallback={<EmptyNowPlaying />}>
						{({ video, requestedBy }) => (
							<Video.List
								video={video}
								requestedBy={requestedBy}
								onClick={() => navigate(`/app/video/${video.id}`)}
								extraThumbnailClass="!w-16 !h-16"
								extraContainerClass="hover:!bg-white/0"
								extraTitleClass="text-lg font-medium"
								contextMenu={getVideoContextMenu({
									modifyContextMenuItems: (items) => {
										items.shift();
										return items;
									},
									video: video,
									appStore: app,
									queueStore: queue,
									navigate,
								})}
							/>
						)}
					</Show>
				</div>

				<QueueActions extraClass="space-x-6" />
			</div>

			<Tabs
				extraContentContainerClass="pt-4 md:pt-6"
				extraTabsClass="w-full"
				items={[
					{
						id: "trackList",
						label: (props) => (
							<TabLabel icon="audioPlaylist" label="Track List" isActive={props.isActive} />
						),
						element: () => (
							<Show when={!queue.isInitialLoading()} fallback={<Videos.List data={[]} isLoading />}>
								<QueueTrackList />
							</Show>
						),
					},
					{
						id: "queueHistory",
						label: (props) => <TabLabel icon="history" label="History" isActive={props.isActive} />,
						element: () => (
							<Show when={!queue.isInitialLoading()} fallback={<Videos.List data={[]} isLoading />}>
								<QueuePlayHistory />
							</Show>
						),
					},
				]}
			/>
		</Container>
	);
};

export const Queue: Component = () => {
	const app = useApp();
	const queue = useQueue();

	onMount(() => app.setTitle("Queue"));

	return (
		<Show when={queue.data() || queue.isInitialLoading()} fallback={<QueueNotFound />}>
			<QueueView />
		</Show>
	);
};
