import { ContextMenuItem } from "@components/ContextMenu";
import { Icon } from "@components/Icon";
import { RouterLink } from "@components/Link";
import { getVideoContextMenu } from "@components/Video";
import { Videos } from "@components/Videos";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useNavigate } from "solid-app-router";
import { Component, Show } from "solid-js";

const EmptyTrack: Component = () => {
	return (
		<div class="flex-col-center justify-center">
			<Icon name="snooze" extraClass="fill-neutral-700 w-48 h-48 md:w-64 md:h-64" />
			<div class="text-lg md:text-xl text-center text-neutral-300">
				Queue is empty,{" "}
				<RouterLink href="/app/search" class="underline underline-offset-2">
					search for a song
				</RouterLink>
				?
			</div>
		</div>
	);
};

export const QueueTrackList: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	const tracks = () => queue.data()?.tracks || [];

	return (
		<Show when={tracks().length} fallback={<EmptyTrack />} keyed>
			<div classList={{ "opacity-50 pointer-events-none": queue.isTrackFreezed() }}>
				<Videos.SortableList
					data={tracks()}
					onSort={({ to }, data) => queue.changeTrackOrder(data.id, to)}
					sortableProps={(t) => {
						const isActive = queue.data()?.nowPlaying?.id === t.id;
						return {
							id: t.id,
							videoProps: {
								video: t.video,
								requestedBy: t.requestedBy,
								extraTitleClass: isActive ? "text-brand-600" : undefined,
								contextMenu: getVideoContextMenu({
									video: t.video,
									appStore: app,
									queueStore: queue,
									navigate,
									modifyContextMenuItems: (c) => {
										const contextMenu = [
											{
												element: () => (
													<ContextMenuItem icon="trashBin" label="Remove from Queue" />
												),
												onClick: () => queue.removeTrack(t),
											},
										];

										if (!isActive) {
											contextMenu.unshift({
												element: () => <ContextMenuItem icon="play" label="Play" />,
												onClick: () => queue.playTrack(t),
											});
										}

										c[0] = contextMenu;
										return c;
									},
								}),
							},
						};
					}}
				/>
			</div>
		</Show>
	);
};
