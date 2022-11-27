import { ContextMenuItem } from "@components/ContextMenu";
import { getVideoContextMenu } from "@components/Video";
import { Videos } from "@components/Videos";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useNavigate } from "solid-app-router";
import { Component, Show } from "solid-js";

export const QueueTrackList: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	const tracks = () => queue.data()?.tracks || [];

	return (
		<Show when={tracks().length} keyed>
			<div class="space-y-1.5">
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
			</div>
		</Show>
	);
};
