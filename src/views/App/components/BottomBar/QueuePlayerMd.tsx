import { RouterLink } from "@components/A";
import { Button } from "@components/Button";
import { ContextMenuItem } from "@components/ContextMenu";
import { Divider } from "@components/Divider";
import { Video } from "@components/Video";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { getVideoContextMenu } from "@utils";
import { QueueActions, SeekSlider } from "@views/Queue";
import { useNavigate } from "solid-app-router";
import { Component, Show } from "solid-js";

const EmptyNowPlaying: Component = () => {
	return (
		<RouterLink
			href="/app/recommendation"
			class="flex flex-row items-center w-full space-x-4 p-1.5 hover:bg-white/[2.5%] rounded"
		>
			<div class="!w-12 !h-12 rounded border border-neutral-600" />
			<div class="text-neutral-400">It's lonely here...</div>
		</RouterLink>
	);
};

const NowPlaying: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	return (
		<div class="w-full max-w-md xl:max-w-lg">
			<Show when={queue.data.nowPlaying} fallback={<EmptyNowPlaying />} keyed>
				{(t) => (
					<Video.List
						video={t.video}
						onClick={() => navigate("/app/queue")}
						hideContextMenuButton
						contextMenu={getVideoContextMenu({
							modifyContextMenuItems: (items) => {
								items[0] = [
									{
										element: () => <ContextMenuItem icon="trashBin" label="Remove from Queue" />,
										onClick: () => queue.removeTrack(t),
									},
								];
								return items;
							},
							video: t.video,
							appStore: app,
							queueStore: queue,
							navigate,
						})}
					/>
				)}
			</Show>
		</div>
	);
};

const Controls: Component = () => {
	const queue = useQueue();

	return (
		<div class="flex-col-center w-full mx-auto">
			<div class="space-y-1 w-full max-w-[36rem] 2xl:max-w-[42rem]">
				<QueueActions extended extraClass="justify-center space-x-2 xl:space-x-4 2xl:space-x-6 w-full" />
				<Show
					when={queue.data.nowPlaying?.video.duration}
					fallback={
						<div class="h-4 px-2 w-full">
							<Divider light extraClass="h-2" />
						</div>
					}
				>
					<SeekSlider
						inline
						max={queue.data.nowPlaying?.video.duration || 0}
						value={(queue.data.position || 0) / 1000}
						onChange={(value) => queue.seek(value * 1000)}
					/>
				</Show>
			</div>
		</div>
	);
};

export const QueuePlayerMd: Component = () => {
	const app = useApp();
	const queue = useQueue();

	return (
		<Show when={!queue.data.empty} keyed>
			<div class="flex-row-center space-x-8 bg-neutral-900 border-t border-neutral-700 p-2 z-10">
				<NowPlaying />
				<Controls />
				<Button
					flat
					title="Add Song"
					icon="plus"
					iconSize="lg"
					class="text-neutral-300 p-4"
					onClick={() => app.setIsQuickSearchModalOpen(true)}
				/>
			</div>
		</Show>
	);
};
