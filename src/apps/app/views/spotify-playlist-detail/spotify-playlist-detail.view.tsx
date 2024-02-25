import { useApp } from "@app/hooks";
import { Container, Divider } from "@common/components";
import { useInfiniteScrolling } from "@common/hooks";
import { MediaSources } from "@media-source/components";
import { MediaSourceContextMenuUtil, MediaSourceFactory } from "@media-source/utils";
import { useQueue } from "@queue/hooks";
import { useParams } from "@solidjs/router";
import { useSpotifyPlaylist, useSpotifyPlaylistTracks } from "@spotify/hooks";
import { Component, Show, createEffect } from "solid-js";
import { MainPlaylist, MainPlaylistSkeleton } from "./components";

export const SpotifyPlaylistDetail: Component = () => {
	const app = useApp();
	const queue = useQueue();
	let container!: HTMLDivElement;

	const params = useParams<{ id: string }>();
	const playlist = useSpotifyPlaylist(params.id);
	const tracks = useSpotifyPlaylistTracks({
		id: params.id,
		onLoad: () => infinite.load(),
	});

	const infinite = useInfiniteScrolling({
		container: () => container,
		callback: tracks.next,
		disabled: () => !tracks.isFetchable(),
	});
	createEffect(() => {
		app.setTitle(playlist.data()?.name || "Your Playlist");
	});

	return (
		<Container size="md" ref={container}>
			<Show when={!playlist.data.loading} fallback={<MainPlaylistSkeleton />}>
				<MainPlaylist
					name={playlist.data()?.name || ""}
					imageUrl={playlist.data()?.images?.at(0)?.url || ""}
					itemCount={playlist.data()?.tracks.total || 0}
					onAddToQueue={() => queue.addSpotifyPlaylist(params.id)}
				/>
			</Show>

			<Divider extraClass="my-8" />

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
