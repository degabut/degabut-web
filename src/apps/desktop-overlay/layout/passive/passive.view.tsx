import { MediaSource } from "@media-source";
import { useQueue } from "@queue";
import { useSettings } from "@settings";
import { Show, type Component } from "solid-js";

export const Passive: Component = () => {
	const { settings } = useSettings();
	const queue = useQueue()!;

	return (
		<Show when={queue.data.nowPlaying} keyed>
			{({ requestedBy, mediaSource }) => {
				const borderWidth = () => {
					return mediaSource.duration
						? Math.min((queue.data.position / 1000 / mediaSource.duration) * 100, 100)
						: 0;
				};

				return (
					<div
						tabIndex={-1}
						class="absolute max-w-sm pointer-events-none"
						style={{ opacity: `${settings["overlay.nowPlaying.opacity"]}%` }}
						classList={{
							"top-4 right-4":
								settings["overlay.nowPlaying.position"] === "tr" ||
								!settings["overlay.nowPlaying.position"],
							"top-4 left-4": settings["overlay.nowPlaying.position"] === "tl",
							"bottom-4 right-4": settings["overlay.nowPlaying.position"] === "br",
							"bottom-4 left-4": settings["overlay.nowPlaying.position"] === "bl",
						}}
					>
						<MediaSource.List
							mediaSource={mediaSource}
							requestedBy={requestedBy}
							size={settings["overlay.nowPlaying.size"]}
							extraContainerClass="relative overflow-hidden bg-black/90 text-shadow"
							extraTitleClassList={{ "text-lg": settings["overlay.nowPlaying.size"] === "lg" }}
							hideInQueue
							hideDefaultRight
							hideContextMenuButton
							lightExtra
							left={() => (
								<div
									class="absolute bottom-0 left-0 h-0.5 bg-brand-700"
									style={{ width: `${borderWidth()}%` }}
								/>
							)}
						/>
					</div>
				);
			}}
		</Show>
	);
};
