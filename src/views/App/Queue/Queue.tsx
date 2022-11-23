import { LoopType } from "@api";
import { Container } from "@components/Container";
import { Icon } from "@components/Icon";
import { TabLabel, Tabs } from "@components/Tabs";
import { getVideoContextMenu, Video } from "@components/Video";
import { Videos } from "@components/Videos";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useNavigate } from "solid-app-router";
import { Component, createMemo, onMount, Show } from "solid-js";
import {
	LoopToggleButton,
	QueuePlayHistory,
	QueueTrackList,
	SettingsButton,
	ShuffleToggleButton,
	SkipButton,
} from "./components";

const QueueNotFound: Component = () => {
	return (
		<div class="flex-col-center w-full h-full justify-center space-y-4">
			<Icon name="musicOff" extraClass="fill-neutral-400/10" />
			<div class="text-xl md:text-2xl text-center text-neutral-300">No Queue Found</div>
		</div>
	);
};

const QueueView: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	const tracks = createMemo(() => queue.data()?.tracks || []);

	return (
		<Container>
			<div class="flex flex-col space-y-6">
				<div class="flex flex-col space-y-3">
					<Show when={queue.data()?.nowPlaying} keyed fallback={<div />}>
						{(track) => (
							<div class="space-y-4">
								<div class="text-xl font-normal">Now Playing</div>
								<Video.ListBig
									{...track}
									contextMenu={getVideoContextMenu({
										video: track.video,
										appStore: app,
										queueStore: queue,
										navigate,
									})}
									extraContainerClass="!bg-transparent"
								/>
							</div>
						)}
					</Show>

					<div class="flex-row-center justify-evenly md:justify-start space-x-4">
						<SkipButton
							onClick={() => queue.skipTrack()}
							disabled={queue.isTrackFreezed() || !queue.data()?.nowPlaying}
						/>
						<ShuffleToggleButton
							defaultValue={!!queue.data()?.shuffle}
							onChange={() => queue.toggleShuffle()}
							disabled={queue.isQueueFreezed()}
						/>
						<LoopToggleButton
							defaultValue={queue.data()?.loopType || LoopType.DISABLED}
							onChange={(t) => queue.changeLoopType(t)}
							disabled={queue.isQueueFreezed()}
						/>
						<Show when={queue.data()?.nowPlaying}>
							<SettingsButton onClearQueue={queue.clear} />
						</Show>
					</div>
				</div>

				<Tabs
					extraContainerClass="pt-4 md:pt-6"
					extraTabsClass="w-full"
					items={[
						{
							id: "trackList",
							label: (props) => (
								<TabLabel icon="audioPlaylist" label="Track List" isActive={props.isActive} />
							),
							element: () => (
								<>
									{queue.isInitialLoading() ? (
										<Videos.List data={[]} isLoading />
									) : (
										<QueueTrackList
											tracks={tracks()}
											nowPlaying={queue.data()?.nowPlaying || null}
											isFreezed={queue.isTrackFreezed()}
											onPlayTrack={queue.playTrack}
											onRemoveTrack={queue.removeTrack}
											onAddToQueue={queue.addTrack}
											onAddToQueueAndPlay={queue.addAndPlayTrack}
										/>
									)}
								</>
							),
						},
						{
							id: "queueHistory",
							label: (props) => <TabLabel icon="history" label="History" isActive={props.isActive} />,
							element: () => (
								<>
									{queue.isInitialLoading() ? (
										<Videos.List data={[]} isLoading />
									) : (
										<QueuePlayHistory
											tracks={queue.data()?.history.slice(1) || []}
											onAddToQueue={queue.addTrack}
											onAddToQueueAndPlay={queue.addAndPlayTrack}
										/>
									)}
								</>
							),
						},
					]}
				/>
			</div>
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
