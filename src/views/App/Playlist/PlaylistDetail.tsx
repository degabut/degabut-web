import { Container } from "@components/Container";
import { ContextMenuItem } from "@components/ContextMenu";
import { Divider } from "@components/Divider";
import { Icon } from "@components/Icon";
import { getVideoContextMenu } from "@components/Video";
import { Videos } from "@components/Videos";
import { useApp } from "@hooks/useApp";
import { usePlaylist } from "@hooks/usePlaylist";
import { useQueue } from "@hooks/useQueue";
import { useNavigate, useParams } from "solid-app-router";
import { Component, createEffect, createSignal } from "solid-js";
import { EditPlaylistModal } from "./components";

export const PlaylistDetail: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	const params = useParams<{ id: string }>();
	const playlist = usePlaylist({ playlistId: () => params.id });
	const [isEditModalOpen, setIsEditModalOpen] = createSignal(false);

	createEffect(() => {
		app.setTitle("Your Playlist");
	});

	const duration = () => {
		const totalSeconds = playlist.totalDuration();

		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		let duration = "";
		if (hours > 0) duration += `${hours}h `;
		if (minutes > 0) duration += `${minutes}m `;
		if (seconds > 0) duration += `${seconds}s`;

		return duration;
	};

	const count = () => {
		const count = playlist.videos()?.length || 0;
		return count + (count === 1 ? " video" : " videos");
	};

	const editPlaylist = async (name: string) => {
		await playlist.update(name);
		setIsEditModalOpen(false);
		await playlist.refetchPlaylist();
	};

	return (
		<Container size="md">
			<div class="space-y-4">
				<div class="flex-row-center justify-between md:justify-start md:space-x-8">
					<div title={playlist.playlist()?.name} class="text-2xl font-medium truncate">
						{playlist.playlist()?.name}
					</div>
					<button onClick={() => setIsEditModalOpen(true)}>
						<Icon
							name="editPencil"
							size="md"
							extraClass="fill-neutral-300 hover:fill-neutral-100 cursor-pointer"
						/>
					</button>
				</div>
				<div class="flex md:flex-row space-x-8">
					<div>{count()}</div>
					<div>{duration()}</div>
				</div>
			</div>

			<Divider extraClass="my-8" />

			<Videos.List
				data={playlist.videos() || []}
				videoProps={(pv) => ({
					video: pv.video,
					contextMenu: getVideoContextMenu({
						video: pv.video,
						appStore: app,
						queueStore: queue,
						navigate,
						modifyContextMenuItems: (c) => {
							c[1].push({
								element: <ContextMenuItem icon="trashBin" label="Remove from Playlist" />,
								onClick: () => pv && playlist.removeVideo(pv.id),
							});
							return c;
						},
					}),
				})}
			/>

			<EditPlaylistModal
				defaultName={playlist.playlist()?.name || ""}
				isOpen={isEditModalOpen()}
				onClose={() => setIsEditModalOpen(false)}
				onSubmit={editPlaylist}
			/>
		</Container>
	);
};
