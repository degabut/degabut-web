import { useApp } from "@app/hooks";
import { Button, Container, ItemDetails, Text } from "@common";
import { MediaSourceFactory, MediaSources } from "@media-source";
import { useQueue } from "@queue";
import { useParams } from "@solidjs/router";
import { useSpotifyPlaylist, useSpotifyPlaylistTracks } from "@spotify";
import { Show, createEffect, type Component } from "solid-js";

export const SpotifyPlaylistDetail: Component = () => {
	const app = useApp();
	const queue = useQueue();

	const params = useParams<{ id: string }>();
	const playlist = useSpotifyPlaylist(params.id);
	const tracks = useSpotifyPlaylistTracks(params.id);

	createEffect(() => {
		app.setTitle(playlist.data()?.name || "");
	});

	const descriptionText = () => {
		const count = playlist.data()?.tracks.total;
		return `${count} ${count === 1 ? "track" : "tracks"}`;
	};

	const canBeAdded = () => {
		return !queue.data.empty && !playlist.data.loading && !!playlist.data()?.tracks.total;
	};

	return (
		<Container size="md">
			<ItemDetails
				title={playlist.data()?.name || ""}
				description={() => <Text.Body1>{descriptionText()}</Text.Body1>}
				infiniteCallback={tracks.next}
				isInfiniteDisabled={!tracks.isFetchable()}
				isLoading={playlist.data.loading}
				actions={() => (
					<Button
						onClick={() => queue.addSpotifyPlaylist(params.id)}
						fill
						theme="brand"
						disabled={!canBeAdded()}
						rounded
						icon="plus"
						class=" text-neutral-850 space-x-2 px-4 py-1.5"
					>
						<Text.Body1>Add to Queue</Text.Body1>
					</Button>
				)}
				image={playlist.data()?.images?.at(0)?.url}
			>
				<Show when={!playlist.data.loading} fallback={<MediaSources.List data={[]} isLoading />}>
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
