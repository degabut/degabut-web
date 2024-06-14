import { AppRoutes } from "@app/routes";
import { A, Button, Icon, useNavigate } from "@common";
import { useDesktop } from "@desktop";
import { MediaSource } from "@media-source";
import { QueueActions, QueueButton, QueueSeekSlider, VolumeSlider, useQueue } from "@queue";
import { useSettings } from "@settings";
import { Show, type Component } from "solid-js";

const EmptyNowPlaying: Component = () => {
	return (
		<A
			href={AppRoutes.Recommendation}
			class="flex flex-row items-center w-full space-x-4 p-1.5 hover:bg-white/5 rounded"
		>
			<div class="!w-12 !h-12 shrink-0 rounded border border-neutral-600" />
			<div class="text-neutral-400">It's lonely here...</div>
		</A>
	);
};

export const QueuePlayer: Component = () => {
	const queue = useQueue();
	const desktop = useDesktop();
	const navigate = useNavigate();
	const { settings, setSettings } = useSettings();

	return (
		<div class="flex bg-black rounded-lg">
			<div class="grow grid grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_minmax(0,1fr)] gap-x-4 lg:gap-x-8 p-2">
				<div class="relative overflow-hidden rounded text-shadow w-full max-w-md xl:max-w-lg">
					<Show when={queue.data.nowPlaying} fallback={<EmptyNowPlaying />} keyed>
						{(t) => (
							<MediaSource.List
								mediaSource={t.mediaSource}
								onClick={() => navigate(AppRoutes.Queue)}
								hideContextMenuButton
								contextMenu={{ openWithClick: false }}
							/>
						)}
					</Show>
				</div>

				<div class="flex-col-center pt-0.5">
					<div class="-space-y-3.5 w-full max-w-[36rem] 2xl:max-w-[42rem]">
						<QueueActions
							iconSize="md"
							extraClass="justify-center space-x-2 lg:space-x-4"
							extraButtonClass="p-2.5"
						/>
						<QueueSeekSlider
							disabled={queue.freezeState.seek}
							max={queue.data.nowPlaying?.mediaSource.duration || 0}
							value={(queue.data.position || 0) / 1000}
							onChange={(value) => queue.seek(value * 1000)}
						/>
					</div>
				</div>

				<div class="flex-row-center justify-end space-x-0.5 lg:space-x-1.5">
					<QueueButton.Lyrics iconSize="md" onClick={() => navigate(AppRoutes.Lyrics)} />
					<QueueButton.Options
						disabled={queue.data.empty}
						iconSize="md"
						onClearQueue={queue.clear}
						onStopQueue={queue.stop}
					/>
					<Show when={settings["discord.rpc"]}>
						<VolumeSlider
							value={settings["botVolumes"][queue.bot().id]}
							onChange={(value) => {
								setSettings("botVolumes", { [queue.bot().id]: value });
								desktop?.ipc?.setBotVolume?.(value, queue.bot().id);
							}}
							onMuteToggled={(isMuted) => {
								desktop?.ipc?.setBotVolume?.(
									isMuted ? 0 : settings["botVolumes"][queue.bot().id],
									queue.bot().id
								);
							}}
						/>
					</Show>
				</div>
			</div>

			<Button
				flat
				title="Expand"
				class="h-full px-1 border-l border-neutral-900 text-neutral-500 rounded-r-lg"
				onClick={() => setSettings("app.player.minimized", false)}
			>
				<Icon name="chevronRight" size="sm" />
			</Button>
		</div>
	);
};
