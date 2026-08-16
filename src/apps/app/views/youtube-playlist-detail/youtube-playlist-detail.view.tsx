import { useApp } from "@app/providers";
import { Button, Container, ItemDetails, Text } from "@common";
import { MediaSourceFactory, MediaSources } from "@media-source";
import { useQueue } from "@queue";
import { useParams } from "@solidjs/router";
import { useYouTubePlaylist, useYouTubePlaylistVideos } from "@youtube";
import { Show, createEffect, type Component } from "solid-js";

export const YouTubePlaylistDetail: Component = () => {
	const app = useApp()!;
	const queue = useQueue()!;

	const params = useParams<{ id: string }>();
	const playlist = useYouTubePlaylist(params.id);
	const videos = useYouTubePlaylistVideos(params.id);

	createEffect(() => {
		app.setTitle(playlist.data()?.title || "");
	});

	const descriptionText = () => {
		const count = playlist.data()?.videoCount;
		return `${count} ${count === 1 ? "video" : "videos"}`;
	};

	const canBeAdded = () => {
		return (
			!queue.data.empty &&
			!playlist.data.loading &&
			!!playlist.data()?.videoCount &&
			!playlist.data()?.isRestricted
		);
	};

	return (
		<Container size="md">
			<ItemDetails
				title={playlist.data()?.title || ""}
				description={() => <Text.Body1>{descriptionText()}</Text.Body1>}
				infiniteCallback={videos.next}
				isInfiniteDisabled={!videos.isFetchable()}
				isLoading={playlist.data.loading}
				actions={() => (
					<Button
						onClick={() => queue.addYouTubePlaylist(params.id)}
						fill
						theme="brand"
						disabled={!canBeAdded()}
						rounded
						icon="plus"
						class="space-x-2 px-8 py-2"
					>
						<Text.Body1 class="font-medium">Add to Queue</Text.Body1>
					</Button>
				)}
				image={playlist.data()?.thumbnails.at(-1)?.url}
			>
				<Show when={!playlist.data.loading} fallback={<MediaSources.List data={[]} isLoading />}>
					<MediaSources.List
						data={videos.data()}
						showWhenLoading
						isLoading={videos.isLoading()}
						mediaSourceProps={(track) => {
							const mediaSource = MediaSourceFactory.fromYoutubeVideo(track);
							return {
								mediaSource,
								inQueue: queue.data.tracks?.some((t) => t.mediaSource.id === mediaSource.id),
							};
						}}
					/>
				</Show>
			</ItemDetails>
		</Container>
	);
};
