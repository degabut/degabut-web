import { useApp } from "@app/hooks";
import { Button, Container } from "@common/components";
import { IPlaylist } from "@playlist/apis";
import { CreatePlaylistModal, Playlist } from "@playlist/components";
import { usePlaylists } from "@playlist/hooks";
import { PlaylistContextMenuUtil } from "@playlist/utils";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { Component, For, Show, createSignal, onMount } from "solid-js";

export const Playlists: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const playlists = usePlaylists();
	const navigate = useNavigate();
	const [isShowCreateModal, setIsShowModalOpen] = createSignal(false);

	onMount(() => {
		app.setTitle("Your Playlists");
	});

	const createPlaylist = async (name: string) => {
		await playlists.createPlaylist(name);
		setIsShowModalOpen(false);
	};

	const promptDeletePlaylist = (playlist: IPlaylist) => {
		app.setConfirmation({
			title: "Delete Playlist",
			message: (
				<div class="text-center">
					Are you sure you want to delete playlist <b>{playlist.name}</b>?
				</div>
			),
			onConfirm: () => playlists.deletePlaylist(playlist.id),
		});
	};

	return (
		<>
			<Container size="md" extraClass="space-y-6">
				<Button
					rounded
					icon="plus"
					class="space-x-3 px-6 py-1.5"
					disabled={(playlists.data()?.length || 0) >= 25}
					onClick={() => setIsShowModalOpen(true)}
				>
					Create Playlist
				</Button>

				<div class="space-y-2">
					<Show
						when={!playlists.data.loading || playlists.data()}
						fallback={<For each={Array(3)}>{() => <Playlist.ListSkeleton />}</For>}
					>
						<For each={playlists.data() || []}>
							{(p) => (
								<Playlist.List
									onClick={() => navigate("/playlist/" + p.id)}
									contextMenu={PlaylistContextMenuUtil.getContextMenu({
										playlist: p,
										queueStore: queue,
										onAddToQueue: () => queue.addPlaylist(p.id),
										onDelete: () => promptDeletePlaylist(p),
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
				onClose={() => setIsShowModalOpen(false)}
				onSubmit={createPlaylist}
			/>
		</>
	);
};
