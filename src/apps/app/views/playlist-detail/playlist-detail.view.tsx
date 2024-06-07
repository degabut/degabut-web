import { useApp } from "@app/hooks";
import { Container, Divider } from "@common";
import { MediaSourceContextMenuUtil, MediaSources } from "@media-source";
import { usePlaylist } from "@playlist";
import { useQueue } from "@queue";
import { useParams } from "@solidjs/router";
import { Show, createEffect, createSignal, type Component } from "solid-js";
import { EditPlaylistModal, MainPlaylist, MainPlaylistSkeleton } from "./components";

export const PlaylistDetail: Component = () => {
	const app = useApp();
	const queue = useQueue();

	const params = useParams<{ id: string }>();
	const playlist = usePlaylist({ playlistId: () => params.id });
	const [isEditModalOpen, setIsEditModalOpen] = createSignal(false);

	createEffect(() => {
		const name = playlist.playlist()?.name;
		if (name) app.setTitle(name);
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
					onClickAddToQueue={() => queue.addPlaylist(params.id)}
				/>
			</Show>

			<Divider extraClass="my-8" />

			<Show when={!playlist.mediaSources.loading} fallback={<MediaSources.List data={[]} isLoading />}>
				<MediaSources.List
					data={playlist.mediaSources()}
					mediaSourceProps={(pv) => ({
						mediaSource: pv.mediaSource,
						inQueue: queue.data.tracks?.some((t) => t.mediaSource.id === pv.mediaSource.id),
						contextMenu: MediaSourceContextMenuUtil.getContextMenu({
							mediaSource: pv.mediaSource,
							appStore: app,
							queueStore: queue,
							modify: (c) => {
								c[1].push({
									label: "Remove from Playlist",
									icon: "playlistRemove",
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
