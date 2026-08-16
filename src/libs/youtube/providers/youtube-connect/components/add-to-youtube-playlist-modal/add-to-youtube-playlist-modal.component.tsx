import { Divider, Icon, Item, Modal, Spinner, Text } from "@common";
import { MediaSource, MediaSourceTypes, type IMediaSource } from "@media-source";
import { useYouTubeConnect, YouTubeConnectionState, YouTubePlaylist, type IYouTubePlaylistCompact } from "@youtube";
import { createEffect, createMemo, createSignal, For, Show, type Component } from "solid-js";

type Props = {
	mediaSource: IMediaSource | null;
	isOpen: boolean;
	onClose: () => void;
};

export const AddToYouTubePlaylistModal: Component<Props> = (props) => {
	const youtube = useYouTubeConnect();
	const [isAdding, setIsAdding] = createSignal<string | null>(null);

	createEffect(() => {
		if (youtube.state?.() === YouTubeConnectionState.Connected) {
			youtube.loadPlaylists?.();
		}
	});

	const playlists = youtube.playlists;
	const isInitialLoading = createMemo(() => {
		if (!playlists) return false;
		return !playlists.data()?.playlists.length && playlists.data.loading;
	});

	const addToPlaylist = async (playlist: IYouTubePlaylistCompact) => {
		const id =
			props.mediaSource?.youtubeVideoId ||
			(props.mediaSource?.type === MediaSourceTypes.Youtube ? props.mediaSource?.sourceId : null) ||
			props.mediaSource?.playedYoutubeVideoId;
		if (!id) return;

		setIsAdding(playlist.id);
		try {
			await youtube.addToPlaylist(playlist.id, id);
			props.onClose();
		} finally {
			setIsAdding(null);
		}
	};

	return (
		<Modal isOpen={props.isOpen} handleClose={props.onClose} extraContainerClass="w-xl max-h-[90vh]" closeOnEscape>
			<Show when={props.mediaSource} keyed>
				{(m) => (
					<div class="flex flex-col h-full">
						<div class="pt-4 md:pt-8 px-2 md:px-8">
							<Text.H2 class="text-center mb-4">Add to YouTube Playlist</Text.H2>
							<MediaSource.List mediaSource={m} extraContainerClass={"hover:bg-white/0!"} />
							<Divider extraClass="my-4" />
						</div>

						<div class="py-8 px-2 md:p-8 pt-0! space-y-2 overflow-auto">
							<Show
								when={props.mediaSource?.youtubeVideoId || props.mediaSource?.playedYoutubeVideoId}
								fallback={
									<div class="flex-col-center space-y-2 text-center py-4">
										<Icon name="youtube" class="text-neutral-700 w-12 h-12" />
										<Text.Body1 class="text-neutral-400">
											This track has no YouTube video associated with it, so it can't be added to
											a YouTube playlist.
										</Text.Body1>
									</div>
								}
							>
								<For each={playlists?.data()?.playlists || []}>
									{(p) => (
										<YouTubePlaylist.List
											playlist={p}
											onClick={() => addToPlaylist(p)}
											extraContainerClassList={{
												"opacity-60 pointer-events-none": isAdding() !== null,
											}}
											right={() => (
												<Show when={isAdding() === p.id}>
													<Spinner size="sm" />
												</Show>
											)}
										/>
									)}
								</For>
								<Show when={isInitialLoading()}>
									<For each={Array(3)}>{() => <Item.ListSkeleton />}</For>
								</Show>
							</Show>
						</div>
					</div>
				)}
			</Show>
		</Modal>
	);
};
