import { useApp } from "@app/providers";
import { AppRoutes } from "@app/routes";
import { Container, Divider, Item, Text, useApi, useNavigate } from "@common";
import {
	CreatePlaylistModal,
	Playlist,
	PlaylistApi,
	PlaylistContextMenuUtil,
	usePlaylists,
	type IPlaylist,
} from "@playlist";
import { useQueue } from "@queue";
import { useYouTubeConnect } from "@youtube";
import { For, Show, createSignal, onMount, type Component } from "solid-js";

export const Playlists: Component = () => {
	const app = useApp()!;
	const queue = useQueue()!;
	const playlists = usePlaylists();
	const navigate = useNavigate();
	const api = useApi();
	const youtube = useYouTubeConnect();
	const [isShowCreateModal, setIsShowCreateModalOpen] = createSignal(false);

	onMount(() => app.setTitle("Your Playlists"));

	const createPlaylist = async (name: string) => {
		await playlists.createPlaylist(name);
		setIsShowCreateModalOpen(false);
	};

	const promptDeletePlaylist = (playlist: IPlaylist) => {
		app.setConfirmation({
			title: "Delete Playlist",
			message: () => (
				<div class="text-center">
					Are you sure you want to delete playlist <b>{playlist.name}</b>?
				</div>
			),
			onConfirm: () => playlists.deletePlaylist(playlist.id),
		});
	};

	const onSyncToYouTube = (playlist: IPlaylist) => {
		youtube.setSyncRequest({
			videoIds: async () => {
				const playlistApi = new PlaylistApi(api.client);
				const mediaSources = await playlistApi.getPlaylistMediaSources(playlist.id, 1, 100);

				return mediaSources
					.map((ms) => ms.mediaSource.youtubeVideoId || ms.mediaSource.playedYoutubeVideoId)
					.filter((id): id is string => !!id);
			},
			defaultPlaylistName: `Degabut - ${playlist.name}`,
		});
	};

	return (
		<>
			<Container size="md" extraClass="space-y-6">
				<Text.H2 class="text-xl font-medium">Your Playlists</Text.H2>

				<Divider />

				<div class="space-y-2">
					<Item.Hint icon="plus" onClick={() => setIsShowCreateModalOpen(true)} label="Create playlist" />
					<Item.Hint icon="heartLine" onClick={() => navigate(AppRoutes.Liked)} label="Liked songs" />
				</div>

				<div class="space-y-2">
					<Show
						when={!playlists.data.loading || playlists.data().length}
						fallback={<For each={Array(5)}>{() => <Item.ListSkeleton />}</For>}
					>
						<For each={playlists.data()}>
							{(p) => (
								<Playlist.List
									onClick={() => navigate(AppRoutes.PlaylistDetail, { params: { id: p.id } })}
									contextMenu={PlaylistContextMenuUtil.getContextMenu({
										playlist: p,
										queueStore: queue,
										youtubeStore: youtube,
										onAddToQueue: () => queue.addPlaylist(p.id),
										onDelete: () => promptDeletePlaylist(p),
										onSyncToYouTube: () => onSyncToYouTube(p),
									})}
									playlist={p}
								/>
							)}
						</For>
					</Show>
				</div>
			</Container>

			<CreatePlaylistModal
				isOpen={isShowCreateModal()}
				onClose={() => setIsShowCreateModalOpen(false)}
				onSubmit={createPlaylist}
			/>
		</>
	);
};
