import { IPlaylist } from "@api";
import { Button, Text } from "@components/atoms";
import { Playlist } from "@components/molecules";
import { Container } from "@components/templates";
import { useApp } from "@hooks/useApp";
import { usePlaylists } from "@hooks/usePlaylists";
import { useQueue } from "@hooks/useQueue";
import { useNavigate } from "@solidjs/router";
import { getPlaylistContextMenu } from "@utils/contextMenu";
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
				<Text.Body1>
					Are you sure you want to delete playlist <b>{playlist.name}</b>?
				</Text.Body1>
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
									onClick={() => navigate("/app/playlist/" + p.id)}
									contextMenu={getPlaylistContextMenu({
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

			<Playlist.CreateModal
				isOpen={isShowCreateModal()}
				onClose={() => setIsShowModalOpen(false)}
				onSubmit={createPlaylist}
			/>
		</>
	);
};
