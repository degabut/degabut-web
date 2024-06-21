import { useApp } from "@app/providers";
import { AppRoutes } from "@app/routes";
import { Button, Container, ItemDetails, Text, useNavigate } from "@common";
import { MediaSources } from "@media-source";
import { usePlaylist } from "@playlist";
import { useQueue } from "@queue";
import { useParams } from "@solidjs/router";
import { createEffect, createSignal, type Component } from "solid-js";
import { EditPlaylistModal } from "./components";

export const PlaylistDetail: Component = () => {
	const app = useApp()!;
	const queue = useQueue()!;
	const navigate = useNavigate();
	const params = useParams<{ id: string }>();
	const playlist = usePlaylist({ playlistId: params.id });

	const [isEditModalOpen, setIsEditModalOpen] = createSignal(false);

	createEffect(() => {
		const name = playlist.playlist()?.name;
		if (name) app.setTitle(name);
	});

	const editPlaylist = async (name: string) => {
		await playlist.renamePlaylist(name);
		setIsEditModalOpen(false);
		await playlist.refetchPlaylist();
	};

	const canBeAdded = () => {
		return !queue.data.empty && !playlist.isPlaylistLoading() && !!playlist.playlist()?.mediaSourceCount;
	};

	const descriptionText = () => {
		const count = playlist.playlist()?.mediaSourceCount;
		return `${count} ${count === 1 ? "song" : "songs"}`;
	};

	return (
		<Container size="md">
			<ItemDetails
				title={playlist.playlist()?.name || ""}
				description={() => <Text.Body1>{descriptionText()}</Text.Body1>}
				image={playlist.playlist()?.images?.sort((a, b) => b.width - a.width)[0]?.url}
				isLoading={playlist.isPlaylistLoading()}
				infiniteCallback={playlist.nextMediaSources}
				isInfiniteDisabled={!playlist.isMediaSourceFetchable()}
				contextMenu={{
					items: [
						{
							label: "Add to Queue",
							icon: "plus",
							onClick: () => queue.addPlaylist(params.id),
						},
						{
							label: "Rename",
							icon: "editPencil",
							onClick: () => setIsEditModalOpen(true),
						},
						{
							label: "Delete",
							icon: "trashBin",
							onClick: () =>
								app.setConfirmation({
									title: `Delete ${playlist.playlist()?.name}`,
									message: "Are you sure you want to delete this playlist?",
									onConfirm: () =>
										playlist.deletePlaylist().then(() => navigate(AppRoutes.Playlists)),
								}),
						},
					],
				}}
				actions={() => (
					<div class="flex-row-center space-x-4">
						<Button
							fill
							theme="brand"
							onClick={() => queue.addPlaylist(params.id)}
							disabled={!canBeAdded()}
							rounded
							icon="plus"
							class=" text-neutral-850 space-x-2 px-4 py-1.5"
						>
							<Text.Body1>Add to Queue</Text.Body1>
						</Button>

						<Button
							onClick={() => setIsEditModalOpen(true)}
							disabled={playlist.isPlaylistLoading()}
							rounded
							icon="editPencil"
							class="space-x-2 px-4 py-1.5"
						>
							<Text.Body1>Rename</Text.Body1>
						</Button>
					</div>
				)}
			>
				<MediaSources.List
					data={playlist.mediaSources}
					isLoading={playlist.isMediaSourceLoading()}
					showWhenLoading
					mediaSourceProps={(pv) => ({
						mediaSource: pv.mediaSource,
						inQueue: queue.data.tracks?.some((t) => t.mediaSource.id === pv.mediaSource.id),
						contextMenu: {
							modify: (c) => {
								c[c.length - 2].push({
									label: "Remove from Playlist",
									icon: "playlistRemove",
									onClick: () => pv && playlist.removeMediaSource(pv.id),
								});
								return c;
							},
						},
					})}
				/>
			</ItemDetails>

			<EditPlaylistModal
				defaultName={playlist.playlist()?.name || ""}
				isOpen={isEditModalOpen()}
				onClose={() => setIsEditModalOpen(false)}
				onSubmit={editPlaylist}
			/>
		</Container>
	);
};
