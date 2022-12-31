import { RouterLink } from "@components/A";
import { ContextMenuItem } from "@components/ContextMenu";
import { Icon } from "@components/Icon";
import { Text } from "@components/Text";
import { contextMenu } from "@directives/contextMenu";
import { useQueue } from "@hooks/useQueue";
import { useApp } from "@providers/AppProvider";
import { useNavigate } from "@solidjs/router";
import { getVideoContextMenu } from "@utils/contextMenu";
import { Component, Show } from "solid-js";
import { QueueActions } from "./QueueActions";

contextMenu;

const Skeleton: Component = () => {
	return (
		<div class="max-w-[32rem] aspect-square mx-auto border-2 border-neutral-800 flex items-center justify-center">
			<Icon name="musicNotes" extraClass="fill-neutral-800 h-full w-auto p-8" />
		</div>
	);
};

export const NowPlayingMd: Component = () => {
	const queue = useQueue();
	const app = useApp();
	const navigate = useNavigate();

	return (
		<div class="hidden lg:block my-auto w-full overflow-y-hidden">
			<Show when={queue.data.nowPlaying} keyed fallback={<Skeleton />}>
				{({ video, id }) => (
					<div
						class="relative max-w-[32rem] aspect-square mx-auto"
						use:contextMenu={getVideoContextMenu({
							queueStore: queue,
							appStore: app,
							navigate,
							video,

							modifyContextMenuItems: (items) => {
								items[0] = [
									{
										element: () => <ContextMenuItem icon="trashBin" label="Remove from Queue" />,
										onClick: () => queue.removeTrack(id),
									},
								];
								return items;
							},
						})}
					>
						<div class="absolute w-full h-full opacity-0 hover:opacity-100 transition flex items-end">
							<div class="w-full flex flex-col justify-end min-h-[50%] bg-gradient-to-t from-black to-black/0">
								<RouterLink
									href={`/app/video/${video.id}`}
									class="text-center space-y-2 truncate text-shadow px-4"
								>
									<Text.H1 truncate>{video.title}</Text.H1>
									<Text.Body2 truncate>{video.channel?.name}</Text.Body2>
								</RouterLink>
								<QueueActions
									extraClass="w-full justify-evenly py-4"
									extraButtonClass="p-4"
									iconSize="lg"
								/>
							</div>
						</div>
						<img src={video.thumbnails.at(-1)?.url || ""} class="h-full object-cover" />
					</div>
				)}
			</Show>
		</div>
	);
};
