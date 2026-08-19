import { Divider, Item, Text } from "@common";
import { MediaSource, type IMediaSource } from "@media-source";
import { For, Show, createMemo, createSignal, type Component } from "solid-js";
import { type IPlaylist } from "../../../apis";
import { usePlaylists } from "../../../hooks";
import { CreatePlaylistModal } from "../../create-playlist-modal";
import { Playlist } from "../../playlist";
import { CreatePlaylistButton } from "./create-playlist-button.component";

type ModalContentProps = {
	mediaSources: IMediaSource[] | null;
	onAddToPlaylist: () => void;
};

export const ModalContent: Component<ModalContentProps> = (props) => {
	const [isCreateModalOpen, setIsCreateModalOpen] = createSignal(false);

	const playlists = usePlaylists();
	const isInitialLoading = createMemo(() => {
		return !playlists.data().length && playlists.data.loading;
	});

	const addToPlaylist = async (playlist: IPlaylist) => {
		const mediaSources = props.mediaSources?.length
			? props.mediaSources
			: props.mediaSources?.length === 1
				? props.mediaSources
				: [];
		if (!mediaSources.length) return;

		for (const mediaSource of mediaSources) {
			await playlists.addPlaylistMediaSource(playlist.id, mediaSource.id);
		}
		props.onAddToPlaylist();
	};

	const createPlaylist = async (name: string) => {
		await playlists.createPlaylist(name);
		setIsCreateModalOpen(false);
	};

	return (
		<>
			<Show when={props.mediaSources && props.mediaSources.length > 0} keyed>
				{(mediaSources) => {
					return (
						<div class="flex flex-col h-full">
							<div class="pt-4 md:pt-8 px-2 md:px-8">
								<Text.H2 class="text-center mb-4">Add to Playlist</Text.H2>
								<Show when={props.mediaSources?.length === 1}>
									<MediaSource.List
										mediaSource={props.mediaSources![0]}
										extraContainerClass={"hover:bg-white/0!"}
									/>
								</Show>
								<Show when={props.mediaSources && props.mediaSources.length > 1}>
									<Text.Caption1 class="text-center mt-2">
										+{(props.mediaSources?.length ?? 0) - 1} more media sources
									</Text.Caption1>
								</Show>
								<Divider extraClass="my-4" />
							</div>

							<div class="py-8 px-2 md:p-8 pt-0! space-y-2 overflow-auto">
								<Show when={(playlists.data().length || 0) < 25 && !isInitialLoading()}>
									<CreatePlaylistButton onClick={() => setIsCreateModalOpen(true)} />
								</Show>
								<For each={playlists.data()}>
									{(p) => <Playlist.List playlist={p} onClick={() => addToPlaylist(p)} />}
								</For>
								<Show when={isInitialLoading()}>
									<For each={Array(3)}>{() => <Item.ListSkeleton />}</For>
								</Show>
							</div>
						</div>
					);
				}}
			</Show>

			<CreatePlaylistModal
				isOpen={isCreateModalOpen()}
				onClose={() => setIsCreateModalOpen(false)}
				onSubmit={createPlaylist}
			/>
		</>
	);
};
