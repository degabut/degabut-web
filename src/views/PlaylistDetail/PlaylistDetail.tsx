import { Container } from "@components/Container";
import { ContextMenuItem } from "@components/ContextMenu";
import { Divider } from "@components/Divider";
import { Videos } from "@components/Videos";
import { useApp } from "@hooks/useApp";
import { usePlaylist } from "@hooks/usePlaylist";
import { useQueue } from "@hooks/useQueue";
import { getVideoContextMenu } from "@utils";
import { useNavigate, useParams } from "solid-app-router";
import { Component, createEffect, createSignal, Show } from "solid-js";
import { EditPlaylistModal, MainPlaylist, MainPlaylistSkeleton } from "./components";

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

	const editPlaylist = async (name: string) => {
		await playlist.update(name);
		setIsEditModalOpen(false);
		await playlist.refetchPlaylist();
	};

	return (
		<Container size="md">
			<Show when={!playlist.playlist.loading && !playlist.videos.loading} fallback={<MainPlaylistSkeleton />}>
				<MainPlaylist
					name={playlist.playlist()?.name || ""}
					duration={playlist.totalDuration()}
					videoCount={playlist.videos()?.length || 0}
					onClickEdit={() => setIsEditModalOpen(true)}
				/>
			</Show>

			<Divider extraClass="my-8" />

			<Show when={!playlist.videos.loading} fallback={<Videos.List data={[]} isLoading />}>
				<Videos.List
					data={playlist.videos() || []}
					videoProps={(pv) => ({
						video: pv.video,
						inQueue: queue.data.tracks?.some((t) => t.video.id === pv.video.id),
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
			</Show>

			<EditPlaylistModal
				defaultName={playlist.playlist()?.name || ""}
				isOpen={isEditModalOpen()}
				onClose={() => setIsEditModalOpen(false)}
				onSubmit={editPlaylist}
			/>
		</Container>
	);
};
