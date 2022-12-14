import { ITrack } from "@api";
import { ContextMenuItem } from "@components/ContextMenu";
import { Videos } from "@components/Videos";
import { useQueue } from "@hooks/useQueue";
import { useSearchable } from "@hooks/useSearchable";
import { useApp } from "@providers/AppProvider";
import { useNavigate } from "@solidjs/router";
import { getVideoContextMenu } from "@utils/contextMenu";
import { Component, Show } from "solid-js";

type Props = {
	keyword: string;
};

export const QueueTrackList: Component<Props> = (props) => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	const tracks = useSearchable({
		keyword: () => props.keyword,
		items: () => queue.data.tracks || [],
		keys: ({ video, requestedBy }) => {
			const keys = [video.title, requestedBy.displayName, requestedBy.nickname, requestedBy.username];
			if (video.channel) keys.push(video.channel.name);
			return keys;
		},
	});

	const videoProps = (t: ITrack) => {
		const isActive = queue.data.nowPlaying?.id === t.id;
		return {
			id: t.id,
			videoProps: {
				video: t.video,
				requestedBy: t.requestedBy,
				extraTitleClass: isActive ? "!text-brand-600" : undefined,
				contextMenu: getVideoContextMenu({
					video: t.video,
					appStore: app,
					queueStore: queue,
					navigate,
					modifyContextMenuItems: (c) => {
						const contextMenu = [
							{
								element: () => <ContextMenuItem icon="trashBin" label="Remove from Queue" />,
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
	};

	return (
		<Show when={tracks().length} keyed>
			<div class="h-full" classList={{ "opacity-50 pointer-events-none": queue.freezeState.track }}>
				<Videos.SortableList
					data={tracks()}
					onSort={({ to }, data) => queue.changeTrackOrder(data.id, to)}
					sortableProps={videoProps}
				/>
			</div>
		</Show>
	);
};
