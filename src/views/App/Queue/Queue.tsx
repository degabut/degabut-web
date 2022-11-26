import { Container } from "@components/Container";
import { Divider } from "@components/Divider";
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
			class="flex flex-row items-center w-full space-x-4 p-1.5 hover:bg-white/[2.5%] rounded"
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
		<Container extraClass="space-y-4">
			<div class="flex flex-col lg:items-start space-y-2 p-2 border border-neutral-700 rounded">
				<Show when={queue.data()?.nowPlaying} keyed fallback={<EmptyNowPlaying />}>
					{({ video, requestedBy }) => (
						<Video.List
							video={video}
							requestedBy={requestedBy}
							onClick={() => navigate(`/app/video/${video.id}`)}
							extraThumbnailClass="!w-16 !h-16"
							extraTitleClass="text-lg font-medium"
							contextMenu={getVideoContextMenu({
								modifyContextMenuItems: (items) => {
									items.shift();
									return items;
								},
								video,
								appStore: app,
								queueStore: queue,
								navigate,
							})}
						/>
					)}
				</Show>

				<Divider extraClass="w-full" />

				<QueueActions extraClass="flex-wrap justify-evenly md:justify-start w-full space-x-8 px-2" />
			</div>

			<Tabs
				extraContentContainerClass="pt-4 md:pt-6"
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
