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
import { QueueActions, QueuePlayHistory, QueueTrackList, SeekSlider } from "./components";
import { QueueHint } from "./components/QueueHint";

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
		<Container extraClass="space-y-8 md:space-y-4">
			<div class="relative flex flex-col lg:items-start space-y-1.5 p-2 border border-neutral-600 rounded bg-black/[25%] text-shadow">
				<Show when={queue.data()?.nowPlaying} keyed fallback={<EmptyNowPlaying />}>
					{({ video, requestedBy }) => (
						<div class="w-full">
							<img
								src={video.thumbnails.at(0)?.url}
								class="absolute top-0 left-0 h-full w-full blur-3xl opacity-50 -z-[1000] pointer-events-none"
							/>

							<Video.List
								video={video}
								requestedBy={requestedBy}
								onClick={() => navigate(`/app/video/${video.id}`)}
								extraThumbnailClass="!w-16 !h-16"
								extraTitleClass="text-lg font-medium bg-opacity-10"
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
						</div>
					)}
				</Show>

				<div class="w-full">
					<Show
						when={queue.data()?.nowPlaying?.video.duration}
						fallback={
							<div class="h-8 px-2">
								<Divider light extraClass="h-7" />
							</div>
						}
					>
						<SeekSlider
							max={queue.data()?.nowPlaying?.video.duration || 0}
							value={(queue.data()?.position || 0) / 1000}
							onChange={(value) => queue.seek(value * 1000)}
						/>
					</Show>
				</div>

				<QueueActions extraClass="flex-wrap justify-between md:justify-start w-full md:space-x-8 px-2 pt-1.5" />
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
								<div class="space-y-4 md:space-y-1.5">
									<QueueTrackList />
									<QueueHint />
								</div>
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
