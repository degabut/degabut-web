import { Divider, Icon, Item, Modal, Spinner, Text } from "@common";
import { MediaSource, type IMediaSource } from "@media-source";
import {
	useYouTubeConnect,
	useYouTubeConnectPlaylists,
	YouTubeConnectionState,
	YouTubePlaylist,
	type IYouTubePlaylistCompact,
} from "@youtube";
import { createEffect, createMemo, createSignal, For, Show, type Component } from "solid-js";

type Props = {
	mediaSources: IMediaSource[] | null;
	isOpen: boolean;
	onClose: () => void;
};

export const AddToYouTubePlaylistModal: Component<Props> = (props) => {
	const youtube = useYouTubeConnect();
	const youtubePlaylists = useYouTubeConnectPlaylists();
	const [isAdding, setIsAdding] = createSignal<string | null>(null);

	createEffect(() => {
		if (youtube.state?.() === YouTubeConnectionState.Connected) {
			youtubePlaylists.next();
		}
	});

	const videoIds = createMemo(() => {
		const sources = props.mediaSources || [];
		return sources
			.map((media) => media.youtubeVideoId || media.playedYoutubeVideoId)
			.filter((id): id is string => !!id);
	});

	const addToPlaylist = async (playlist: IYouTubePlaylistCompact) => {
		const ids = videoIds();
		if (!ids.length) return;

		setIsAdding(playlist.id);
		try {
			// TODO filter out existing ids
			for (const id of ids) {
				await youtube.addToPlaylist(playlist.id, id);
			}
			props.onClose();
		} finally {
			setIsAdding(null);
		}
	};

	return (
		<Modal
			isOpen={props.isOpen}
			handleClose={props.onClose}
			extraContainerClass="w-xl max-h-[90vh] flex flex-col"
			closeOnEscape
		>
			<Show when={props.mediaSources} keyed>
				{(sources) => (
					<div class="flex flex-col h-full min-h-0">
						<div class="shrink-0 pt-4 md:pt-8 px-2 md:px-8">
							<Text.H2 class="text-center mb-4">Add to YouTube Playlist</Text.H2>
							<div class="space-y-1">
								<Show
									when={sources.length === 1}
									fallback={
										<Item.List
											title={`${sources.length} song(s)`}
											imageUrl={sources[0].minThumbnailUrl}
										/>
									}
								>
									<MediaSource.List
										mediaSource={sources[0]}
										extraContainerClass={"hover:bg-white/0!"}
									/>
								</Show>
							</div>
							<Divider extraClass="my-4" />
						</div>

						<div class="min-h-0 grow overflow-y-auto py-8 px-2 md:p-8 pt-0! space-y-2">
							<Show
								when={videoIds().length}
								fallback={
									<div class="flex-col-center space-y-2 text-center py-4">
										<Icon name="youtube" class="text-neutral-700 w-12 h-12" />
										<Text.Body1 class="text-neutral-400">
											These tracks have no YouTube video associated with them, so they can't be
											added to a YouTube playlist.
										</Text.Body1>
									</div>
								}
							>
								<For each={youtubePlaylists.data()}>
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
								<Show when={youtubePlaylists.isInitialLoading()}>
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
