import { ContextMenuItem } from "@components/ContextMenu";
import { Icon } from "@components/Icon";
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
		<div class="max-w-sm aspect-square mx-auto border-2 border-neutral-800 flex items-center justify-center">
			<Icon name="musicNotes" extraClass="fill-neutral-800 h-full w-auto" />
		</div>
	);
};

export const NowPlayingMd: Component = () => {
	const queue = useQueue();
	const app = useApp();
	const navigate = useNavigate();

	return (
		<div class="hidden lg:block my-auto w-full">
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
							<div class="w-full flex items-end h-1/3 bg-gradient-to-t from-black/90 to-black/0">
								<QueueActions
									extraClass="w-full justify-evenly py-4"
									extraButtonClass="p-4"
									iconSize="xl"
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