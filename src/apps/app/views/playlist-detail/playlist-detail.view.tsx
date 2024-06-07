import { useApp } from "@app/hooks";
import { Container, Divider, useInfiniteScrolling } from "@common";
import { MediaSourceContextMenuUtil, MediaSources } from "@media-source";
import { usePlaylist } from "@playlist";
import { useQueue } from "@queue";
import { useParams } from "@solidjs/router";
import { Show, createEffect, createSignal, type Component } from "solid-js";
import { EditPlaylistModal, MainPlaylist, MainPlaylistSkeleton } from "./components";

export const PlaylistDetail: Component = () => {
	let containerElement!: HTMLDivElement;
	const app = useApp();
	const queue = useQueue();
	const params = useParams<{ id: string }>();
	const playlist = usePlaylist({ playlistId: params.id, onLoad: () => infinite.load() });

	const infinite = useInfiniteScrolling({
		callback: playlist.nextMediaSources,
		container: () => containerElement,
		disabled: () => !playlist.isMediaSourceFetchable(),
	});

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
		<Container size="md" ref={containerElement}>
			<Show when={!playlist.isPlaylistLoading()} fallback={<MainPlaylistSkeleton />}>
				<MainPlaylist
					name={playlist.playlist()?.name || ""}
					itemCount={playlist.playlist()?.mediaSourceCount || 0}
					onClickEdit={() => setIsEditModalOpen(true)}
					onClickAddToQueue={() => queue.addPlaylist(params.id)}
				/>
			</Show>

			<Divider extraClass="my-8" />

			<MediaSources.List
				data={playlist.mediaSources}
				isLoading={playlist.isMediaSourceLoading()}
				showWhenLoading
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

			<EditPlaylistModal
				defaultName={playlist.playlist()?.name || ""}
				isOpen={isEditModalOpen()}
				onClose={() => setIsEditModalOpen(false)}
				onSubmit={editPlaylist}
			/>
		</Container>
	);
};
