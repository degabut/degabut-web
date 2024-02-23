import { useApp } from "@app/hooks";
import { Container, Divider } from "@common/components";
import { MediaSources } from "@media-source/components";
import { MediaSourceContextMenuUtil, MediaSourceFactory } from "@media-source/utils";
import { useQueue } from "@queue/hooks";
import { useParams } from "@solidjs/router";
import { useSpotifyPlaylist, useSpotifyPlaylistTracks } from "@spotify/hooks";
import { Component, Show, createEffect } from "solid-js";
import { MainPlaylist, MainPlaylistSkeleton } from "./components";

export const SpotifyPlaylist: Component = () => {
	const app = useApp();
	const queue = useQueue();

	const params = useParams<{ id: string }>();
	const playlist = useSpotifyPlaylist(params.id);
	const tracks = useSpotifyPlaylistTracks(params.id);

	createEffect(() => {
		app.setTitle(playlist.data()?.name || "Your Playlist");
	});

	return (
		<Container size="md">
			<Show when={!playlist.data.loading} fallback={<MainPlaylistSkeleton />}>
				<MainPlaylist
					name={playlist.data()?.name || ""}
					imageUrl={playlist.data()?.images?.at(0)?.url || ""}
					onAddToQueue={() => queue.addSpotifyPlaylist(params.id)}
				/>
			</Show>

			<Divider extraClass="my-8" />

			<Show when={!playlist.data.loading} fallback={<MediaSources.List data={[]} isLoading />}>
				<MediaSources.List
					data={tracks.data()}
					mediaSourceProps={(track) => {
						const mediaSource = MediaSourceFactory.fromSpotifyTrack(track);

						return {
							mediaSource,
							inQueue: queue.data.tracks?.some((t) => t.mediaSource.id === mediaSource.id),
							contextMenu: MediaSourceContextMenuUtil.getContextMenu({
								mediaSource,
								appStore: app,
								queueStore: queue,
							}),
						};
					}}
				/>
			</Show>
		</Container>
	);
};
