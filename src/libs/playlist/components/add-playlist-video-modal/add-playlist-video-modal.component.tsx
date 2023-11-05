import { Divider, Icon, Modal, Text } from "@common/components";
import { IPlaylist } from "@playlist/apis";
import { CreatePlaylistModal, Playlist } from "@playlist/components";
import { usePlaylists } from "@playlist/hooks";
import { IVideoCompact } from "@youtube/apis";
import { Video } from "@youtube/components";
import { Component, For, Show, createEffect, createMemo, createSignal } from "solid-js";

const CreatePlaylistButton: Component<{ onClick: () => void }> = (props) => {
	return (
		<button
			onClick={() => props.onClick()}
			class="w-full h-[3.625rem] border-2 border-dashed border-neutral-600 hover:border-neutral-500 hover:bg-white/5 rounded"
		>
			<div class="flex-row-center space-x-2 px-3">
				<Icon name="plus" size="md" extraClass="fill-neutral-400" />
				<div>Create New Playlist</div>
			</div>
		</button>
	);
};

type Props = {
	video: IVideoCompact | null;
	isOpen: boolean;
	onClose: () => void;
};

export const AddPlaylistVideoModal: Component<Props> = (props) => {
	const playlists = usePlaylists();

	const [isCreateModalOpen, setIsCreateModalOpen] = createSignal(false);

	createEffect(() => {
		if (props.isOpen) {
			playlists.mutate([]);
			playlists.refetch();
		}
	});

	const isInitialLoading = createMemo(() => {
		return !playlists.data()?.length && playlists.data.loading;
	});

	const addToPlaylist = async (playlist: IPlaylist) => {
		if (!props.video) return;
		await playlists.addPlaylistVideo(playlist.id, props.video.id);
		props.onClose();
	};

	const createPlaylist = async (name: string) => {
		await playlists.createPlaylist(name);
		setIsCreateModalOpen(false);
	};

	return (
		<Modal
			extraContainerClass="absolute w-[42rem] h-[90vh] md:h-[70vh] overflow-auto"
			isOpen={props.isOpen}
			closeOnEscape
			onClickOutside={() => props.onClose()}
		>
			<Show when={props.video} keyed>
				{(v) => (
					<div class="flex flex-col h-full">
						<div class="pt-4 md:pt-8 px-2 md:px-8">
							<Text.H2 class="text-center mb-4">Add to Playlist</Text.H2>
							<Video.List video={v} extraContainerClass={"hover:!bg-white/0"} />
							<Divider extraClass="my-4" />
						</div>

						<div class="py-8 px-2 md:p-8 !pt-0 space-y-3 overflow-auto">
							<Show when={(playlists.data()?.length || 0) < 25 && !isInitialLoading()}>
								<CreatePlaylistButton onClick={() => setIsCreateModalOpen(true)} />
							</Show>
							<For each={playlists.data() || []}>
								{(p) => <Playlist.List playlist={p} onClick={addToPlaylist} />}
							</For>
							<Show when={isInitialLoading()}>
								<For each={Array(3)}>{() => <Playlist.ListSkeleton />}</For>
							</Show>
						</div>
					</div>
				)}
			</Show>

			<CreatePlaylistModal
				isOpen={isCreateModalOpen()}
				onClose={() => setIsCreateModalOpen(false)}
				onSubmit={createPlaylist}
			/>
		</Modal>
	);
};
