import { useApp } from "@app/hooks";
import { RouterLink } from "@common/components";
import { useDesktop } from "@desktop/hooks";
import { QueueActions, QueueButton, QueueSeekSlider, VolumeSlider } from "@queue/components";
import { useQueue } from "@queue/hooks";
import { useSettings } from "@settings/hooks";
import { useNavigate } from "@solidjs/router";
import { Video } from "@youtube/components";
import { YouTubeContextMenuUtil } from "@youtube/utils";
import { Component, Show } from "solid-js";

const EmptyNowPlaying: Component = () => {
	return (
		<RouterLink
			href="/recommendation"
			class="flex flex-row items-center w-full space-x-4 p-1.5 hover:bg-white/5 rounded"
		>
			<div class="!w-12 !h-12 shrink-0 rounded border border-neutral-600" />
			<div class="text-neutral-400">It's lonely here...</div>
		</RouterLink>
	);
};

export const QueuePlayer: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const desktop = useDesktop();
	const navigate = useNavigate();
	const { settings } = useSettings();

	return (
		<Show when={!queue.data.empty} keyed>
			<div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)] gap-x-8 bg-black p-2 z-10 rounded-lg">
				<div class="relative z-10 overflow-hidden rounded text-shadow w-full max-w-md xl:max-w-lg">
					<Show when={queue.data.nowPlaying} fallback={<EmptyNowPlaying />} keyed>
						{(t) => (
							<Video.List
								video={t.video}
								onClick={() => navigate("/queue")}
								hideContextMenuButton
								contextMenu={YouTubeContextMenuUtil.getVideoContextMenu({
									video: t.video,
									appStore: app,
									queueStore: queue,
									navigate,
								})}
							/>
						)}
					</Show>
				</div>

				<div class="flex-col-center pt-0.5">
					<div class="-space-y-3.5 w-full max-w-[36rem] 2xl:max-w-[42rem]">
						<QueueActions extraClass="justify-center space-x-6" />
						<QueueSeekSlider
							disabled={queue.freezeState.seek}
							max={queue.data.nowPlaying?.video.duration || 0}
							value={(queue.data.position || 0) / 1000}
							onChange={(value) => queue.seek(value * 1000)}
						/>
					</div>
				</div>

				<div class="flex items-center justify-end space-x-0.5">
					<QueueButton.Lyrics iconSize="md" onClick={() => navigate("/queue/lyrics")} />
					<QueueButton.Settings
						iconSize="md"
						onClearQueue={() => queue.clear()}
						onStopQueue={() => queue.stop()}
					/>
					<Show when={settings["discord.rpc"]}>
						<VolumeSlider onVolumeChange={(v) => desktop?.ipc.setBotVolume(v, queue.bot().id)} />
					</Show>
				</div>
			</div>
		</Show>
	);
};
