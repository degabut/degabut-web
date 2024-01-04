import { useApp } from "@app/hooks";
import { Icon, Text } from "@common/components";
import { contextMenu } from "@common/directives";
import { MediaSourceContextMenuUtil } from "@media-source/utils";
import { QueueActions } from "@queue/components";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { Component, Show } from "solid-js";

contextMenu;

export const PreviewThumbnail: Component = () => {
	const queue = useQueue();
	const app = useApp();
	const navigate = useNavigate();

	return (
		<Show when={queue.data.nowPlaying} keyed fallback={<Skeleton />}>
			{({ mediaSource }) => (
				<div
					class="relative w-full max-w-[32rem] aspect-square mx-auto"
					use:contextMenu={MediaSourceContextMenuUtil.getContextMenu({
						queueStore: queue,
						appStore: app,
						navigate,
						mediaSource,
					})}
				>
					<div class="absolute w-full h-full opacity-0 hover:opacity-100 transition flex items-end">
						<div class="w-full flex flex-col justify-end min-h-[50%] bg-gradient-to-t from-black to-black/0">
							<div class="text-center space-y-2 truncate text-shadow px-4">
								<Text.H1 truncate>{mediaSource.title}</Text.H1>
								<Text.Body2 truncate>{mediaSource.creator}</Text.Body2>
							</div>
							<QueueActions
								extraClass="w-full justify-evenly py-4"
								extraButtonClass="p-4"
								iconSize="lg"
							/>
						</div>
					</div>
					<img src={mediaSource.maxThumbnailUrl} class="h-full object-cover" />
				</div>
			)}
		</Show>
	);
};

const Skeleton: Component = () => {
	return (
		<div class="w-full max-w-[32rem] aspect-square mx-auto border border-white opacity-10 flex items-center justify-center">
			<Icon name="musicNotes" extraClass="fill-white h-[50%] w-auto p-8" />
		</div>
	);
};
