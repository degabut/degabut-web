import { RouterLink } from "@components/A";
import { Button } from "@components/Button";
import { ContextMenuItem } from "@components/ContextMenu";
import { Divider } from "@components/Divider";
import { Video } from "@components/Video";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useNavigate } from "@solidjs/router";
import { getVideoContextMenu } from "@utils";
import { QueueActions, SeekSlider } from "@views/Queue";
import { LyricsButton } from "@views/Queue/components/QueuePlayer/QueueActions/components";
import { Component, Show } from "solid-js";

const EmptyNowPlaying: Component = () => {
	return (
		<RouterLink
			href="/app/recommendation"
			class="flex flex-row items-center w-full space-x-4 p-1.5 hover:bg-white/[2.5%] rounded"
		>
			<div class="!w-12 !h-12 shrink-0 rounded border border-neutral-600" />
			<div class="text-neutral-400">It's lonely here...</div>
		</RouterLink>
	);
};

const NowPlaying: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	return (
		<div
			class="relative z-10 overflow-hidden rounded text-shadow w-full max-w-md xl:max-w-lg"
			classList={{ "bg-gray-800": !!queue.data.nowPlaying }}
		>
			<Show when={queue.data.nowPlaying} fallback={<EmptyNowPlaying />} keyed>
				{(t) => (
					<>
						<img
							src={t.video.thumbnails.at(0)?.url}
							class="absolute top-0 left-0 h-full w-full blur-2xl -z-10 pointer-events-none"
						/>

						<Video.List
							video={t.video}
							onClick={() => navigate("/app/queue")}
							hideContextMenuButton
							contextMenu={getVideoContextMenu({
								modifyContextMenuItems: (items) => {
									items[0] = [
										{
											element: () => (
												<ContextMenuItem icon="trashBin" label="Remove from Queue" />
											),
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
					</>
				)}
			</Show>
		</div>
	);
};

const Controls: Component = () => {
	const queue = useQueue();

	return (
		<div class="flex-col-center justify-center">
			<div class="space-y-1 w-full max-w-[36rem] 2xl:max-w-[42rem]">
				<QueueActions extraClass="justify-center space-x-6" />
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
						disabled={queue.freezeState.seek}
						max={queue.data.nowPlaying?.video.duration || 0}
						value={(queue.data.position || 0) / 1000}
						onChange={(value) => queue.seek(value * 1000)}
					/>
				</Show>
			</div>
		</div>
	);
};

export const ExtraControls: Component = () => {
	const app = useApp();
	const navigate = useNavigate();

	return (
		<div class="flex items-center justify-end space-x-2">
			<LyricsButton onClick={() => navigate("/app/queue/lyrics")} />
			<Button
				flat
				title="Add Song"
				icon="plus"
				iconSize="lg"
				class="text-neutral-300 p-2"
				onClick={() => app.setIsQuickSearchModalOpen(true)}
			/>
		</div>
	);
};

export const QueuePlayerMd: Component = () => {
	const queue = useQueue();

	return (
		<Show when={!queue.data.empty} keyed>
			<div class="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] gap-x-8 bg-neutral-900 border-t border-neutral-700 p-2 z-10">
				<NowPlaying />
				<Controls />
				<ExtraControls />
			</div>
		</Show>
	);
};
