import { useApp, useSettings } from "@app/hooks";
import { Button, Icon, RouterLink, Slider } from "@common/components";
import { DesktopUtil } from "@desktop/utils";
import { QueueActions, QueueButton, QueueSeekSlider } from "@queue/components";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { Video } from "@youtube/components";
import { YouTubeContextMenuUtil } from "@youtube/utils";
import { Component, Show, createEffect, createSignal } from "solid-js";

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

const NowPlaying: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	return (
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
	);
};

const Controls: Component = () => {
	const queue = useQueue();

	return (
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
	);
};

const VolumeSlider: Component = () => {
	const [volumeLevel, setVolumeLevel] = createSignal(25);
	const [isMuted, setIsMuted] = createSignal(false);

	const onVolumeChange = (e: Event) => {
		setIsMuted(false);
		const value = +(e.target as HTMLInputElement).value;
		setVolumeLevel(value);
	};

	createEffect(() => {
		DesktopUtil.setBotVolume(isMuted() ? 0 : volumeLevel());
	});

	return (
		<div class="flex flex-row space-x-2 mx-auto items-center justify-center">
			<Button
				flat
				class="w-9 h-9"
				classList={{
					"p-1.5": volumeLevel() > 100,
					"p-2.5": volumeLevel() <= 100,
				}}
				onClick={() => setIsMuted((v) => !v)}
			>
				<Icon
					name={
						isMuted() || volumeLevel() === 0
							? "soundOff"
							: volumeLevel() > 0 && volumeLevel() <= 100
							? "soundMedium"
							: "soundFull"
					}
					extraClass="fill-neutral-300"
					extraClassList={{
						"w-4 h-4": volumeLevel() <= 100 || isMuted(),
						"w-[1.25rem] h-[1.05rem]": volumeLevel() > 100,
					}}
				/>
			</Button>
			<Slider
				min={0}
				max={200}
				value={isMuted() ? 0 : volumeLevel()}
				onInput={onVolumeChange}
				class="h-1 w-24 accent-brand-600"
			/>
		</div>
	);
};

const ExtraControls: Component = () => {
	const queue = useQueue();
	const navigate = useNavigate();
	const { settings } = useSettings();

	return (
		<>
			<div class="flex items-center justify-end space-x-0.5">
				<QueueButton.Lyrics iconSize="md" extraClass="p-2.5" onClick={() => navigate("/queue/lyrics")} />
				<QueueButton.Settings
					iconSize="md"
					extraClass="p-2.5"
					onClearQueue={() => queue.clear()}
					onStopQueue={() => queue.stop()}
				/>
				<Show when={settings["discord.rpc"]}>
					<VolumeSlider />
				</Show>
			</div>
		</>
	);
};

export const QueuePlayer: Component = () => {
	const queue = useQueue();

	return (
		<Show when={!queue.data.empty} keyed>
			<div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)] gap-x-8 bg-black p-2 z-10 rounded-lg">
				<NowPlaying />
				<Controls />
				<ExtraControls />
			</div>
		</Show>
	);
};
