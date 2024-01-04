import { useApp } from "@app/hooks";
import { Container, Divider } from "@common/components";
import { MediaSources } from "@media-source/components";
import { MediaSourceContextMenuUtil } from "@media-source/utils";
import { usePlaylist } from "@playlist/hooks";
import { useQueue } from "@queue/hooks";
import { useNavigate, useParams } from "@solidjs/router";
import { Component, Show, createEffect, createSignal } from "solid-js";
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
			<Show
				when={!playlist.playlist.loading && !playlist.mediaSources.loading}
				fallback={<MainPlaylistSkeleton />}
			>
				<MainPlaylist
					name={playlist.playlist()?.name || ""}
					duration={playlist.totalDuration()}
					itemCount={playlist.playlist()?.mediaSourceCount || 0}
					onClickEdit={() => setIsEditModalOpen(true)}
				/>
			</Show>

			<Divider extraClass="my-8" />

			<Show when={!playlist.mediaSources.loading} fallback={<MediaSources.List data={[]} isLoading />}>
				<MediaSources.List
					data={playlist.mediaSources() || []}
					mediaSourceProps={(pv) => ({
						mediaSource: pv.mediaSource,
						inQueue: queue.data.tracks?.some((t) => t.mediaSource.id === pv.mediaSource.id),
						contextMenu: MediaSourceContextMenuUtil.getContextMenu({
							mediaSource: pv.mediaSource,
							appStore: app,
							queueStore: queue,
							navigate,
							modify: (c) => {
								c[1].push({
									label: "Remove from Playlist",
									icon: "trashBin",
									onClick: () => pv && playlist.removeMediaSource(pv.id),
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
