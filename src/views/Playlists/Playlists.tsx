import { IPlaylist } from "@api";
import { Button } from "@components/Button";
import { Container } from "@components/Container";
import { Playlist } from "@components/Playlist";
import { useApp } from "@hooks/useApp";
import { usePlaylists } from "@hooks/usePlaylists";
import { useQueue } from "@hooks/useQueue";
import { useNavigate } from "@solidjs/router";
import { Component, createSignal, For, onMount, Show } from "solid-js";

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
				<>
					Are you sure you want to delete playlist <b>{playlist.name}</b>?
				</>
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

				<div class="space-y-3">
					<Show
						when={!playlists.data.loading || playlists.data()}
						fallback={<For each={Array(3)}>{() => <Playlist.ListSkeleton />}</For>}
					>
						<For each={playlists.data() || []}>
							{(p) => (
								<Playlist.List
									onAddToQueue={() => queue.addPlaylist(p.id)}
									onDelete={promptDeletePlaylist}
									onClick={() => navigate("/app/playlist/" + p.id)}
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
