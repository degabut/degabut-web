import { Button } from "@components/Button";
import { Container } from "@components/Container";
import { Icon } from "@components/Icon";
import { Playlist } from "@components/Playlist";
import { useApp } from "@hooks/useApp";
import { usePlaylists } from "@hooks/usePlaylists";
import { useQueue } from "@hooks/useQueue";
import { useNavigate } from "solid-app-router";
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

	return (
		<>
			<Container size="md" extraClass="space-y-6">
				<Button
					rounded
					class="space-x-3 !py-1.5"
					disabled={(playlists.data()?.length || 0) >= 25}
					onClick={() => setIsShowModalOpen(true)}
				>
					<Icon name="plus" size="md" extraClass="fill-white" />
					<div>Create Playlist</div>
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
									onDelete={() =>
										app.setConfirmation({
											title: "Delete Playlist",
											message: (
												<>
													Are you sure you want to delete playlist <b>{p.name}</b>?
												</>
											),
											onConfirm: () => playlists.deletePlaylist(p.id),
										})
									}
									onClick={() => navigate("/app/u/me/playlists/" + p.id)}
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
