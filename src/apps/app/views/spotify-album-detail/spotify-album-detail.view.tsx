import { useApp } from "@app/providers";
import { Button, Container, ItemDetails, Text } from "@common";
import { MediaSourceFactory, MediaSources } from "@media-source";
import { useQueue } from "@queue";
import { useParams } from "@solidjs/router";
import { useSpotifyAlbum, useSpotifyAlbumTracks } from "@spotify";
import { Show, createEffect, type Component } from "solid-js";

export const SpotifyAlbumDetail: Component = () => {
	const app = useApp()!;
	const queue = useQueue()!;

	const params = useParams<{ id: string }>();
	const album = useSpotifyAlbum(params.id);
	const tracks = useSpotifyAlbumTracks({
		id: params.id,
	});

	createEffect(() => {
		app.setTitle(album.data()?.name || "");
	});

	const descriptionText = () => {
		const count = album.data()?.tracks.total;
		return `${count} ${count === 1 ? "track" : "tracks"}`;
	};

	const canBeAdded = () => {
		return !queue.data.empty && !album.data.loading && !!album.data()?.tracks.total;
	};

	return (
		<Container size="md">
			<ItemDetails
				title={album.data()?.name || ""}
				description={() => <Text.Body1>{descriptionText()}</Text.Body1>}
				isLoading={album.data.loading}
				infiniteCallback={tracks.next}
				isInfiniteDisabled={!tracks.isFetchable()}
				actions={() => (
					<Button
						onClick={() => queue.addSpotifyAlbum(params.id)}
						fill
						theme="brand"
						disabled={!canBeAdded()}
						rounded
						icon="plus"
						class="space-x-2 px-4 py-1.5"
					>
						<Text.Body1>Add to Queue</Text.Body1>
					</Button>
				)}
				image={album.data()?.images?.at(0)?.url}
			>
				<Show when={!album.data.loading} fallback={<MediaSources.List data={[]} isLoading />}>
					<MediaSources.List
						data={tracks.data()}
						showWhenLoading
						isLoading={tracks.isLoading()}
						mediaSourceProps={(track) => {
							const mediaSource = MediaSourceFactory.fromSpotifyTrack(track);
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
