import { Button, Divider, Text } from "@common";
import { useDesktop } from "@desktop";
import { SourceBadge, useLikeMediaSource } from "@media-source";
import { QueueActions, QueueSeekSlider, VolumeSlider, useQueue } from "@queue";
import { useSettings } from "@settings";
import { Show, type Component } from "solid-js";
import { Card } from "../../../components";

export const PlayerCard: Component = () => {
	const queue = useQueue()!;
	const desktop = useDesktop();
	const { settings, setSettings } = useSettings();

	return (
		<Card>
			<div class="relative flex-col-center justify-end space-y-8 h-full">
				<Show when={queue.data.nowPlaying} keyed>
					{({ mediaSource }) => (
						<img
							src={mediaSource.maxThumbnailUrl || ""}
							class="absolute top-0 left-0 opacity-25 w-full h-1/2 blur-[96px]"
						/>
					)}
				</Show>

				<Show when={queue.data.nowPlaying} keyed>
					{({ mediaSource }) => {
						const like = useLikeMediaSource(() => mediaSource.id);

						return (
							<div class="relative w-full grow flex-row-center space-x-4">
								<img
									src={mediaSource.maxThumbnailUrl || ""}
									class="grow h-full max-h-32 aspect-square object-cover rounded"
								/>

								<div class="flex flex-col w-full text-shadow truncate space-y-2.5">
									<Text.H1 truncate class="w-full text-2xl text-shadow">
										{mediaSource.title}
									</Text.H1>
									<Show when={mediaSource.creator} keyed>
										{(c) => (
											<div class="flex-row-center space-x-2.5">
												<SourceBadge type={mediaSource.type} size="lg" />
												<Text.Body2 truncate class="w-full">
													{c}
												</Text.Body2>
											</div>
										)}
									</Show>
								</div>

								<Button
									flat
									theme={like?.isLiked() ? "brand" : "default"}
									icon={like?.isLiked() ? "heart" : "heartLine"}
									class="p-4"
									iconSize="lg"
									onClick={like?.toggle}
								/>
							</div>
						);
					}}
				</Show>

				<div class="w-full relative">
					<QueueSeekSlider
						disabled={queue.freezeState.seek}
						max={queue.data.nowPlaying?.mediaSource.duration || 0}
						onChange={(value) => queue.seek(value * 1000)}
						value={(queue.data.position || 0) / 1000}
					/>
				</div>

				<div class="w-full relative">
					<QueueActions extraClass="justify-around w-full" extraButtonClass="p-4" iconSize="lg" />

					<Divider dark extraClass="mt-8 mb-4" />

					<div class="flex-row-center justify-center">
						<Show when={settings["discord.rpc"]}>
							<VolumeSlider
								extraContainerClass="max-w-44"
								extraButtonClass="p-2.5"
								iconSize="md"
								value={settings["botVolumes"][queue.bot().id]}
								onChange={(volume) => {
									setSettings("botVolumes", { [queue.bot().id]: volume });
									desktop?.ipc.send?.("set-bot-volume", { volume, id: queue.bot().id });
								}}
								onMuteToggled={(isMuted) => {
									desktop?.ipc.send?.("set-bot-volume", {
										volume: isMuted ? 0 : settings["botVolumes"][queue.bot().id],
										id: queue.bot().id,
									});
								}}
							/>
						</Show>
					</div>
				</div>
			</div>
		</Card>
	);
};
