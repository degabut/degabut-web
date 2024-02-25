import { useApp } from "@app/hooks";
import { Container, Divider } from "@common/components";
import { useInfiniteScrolling } from "@common/hooks";
import { MediaSources } from "@media-source/components";
import { MediaSourceContextMenuUtil, MediaSourceFactory } from "@media-source/utils";
import { useQueue } from "@queue/hooks";
import { useParams } from "@solidjs/router";
import { useSpotifyAlbum, useSpotifyAlbumTracks } from "@spotify/hooks";
import { Component, Show, createEffect } from "solid-js";
import { MainAlbum, MainAlbumSkeleton } from "./components";

export const SpotifyAlbumDetail: Component = () => {
	const app = useApp();
	const queue = useQueue();
	let container!: HTMLDivElement;

	const params = useParams<{ id: string }>();
	const album = useSpotifyAlbum(params.id);
	const tracks = useSpotifyAlbumTracks({
		id: params.id,
		onLoad: () => infinite.load(),
	});

	const infinite = useInfiniteScrolling({
		container: () => container,
		callback: tracks.next,
		disabled: () => !tracks.isFetchable(),
	});
	createEffect(() => {
		app.setTitle(album.data()?.name || "Your Album");
	});

	return (
		<Container size="md" ref={container}>
			<Show when={!album.data.loading} fallback={<MainAlbumSkeleton />}>
				<MainAlbum
					name={album.data()?.name || ""}
					imageUrl={album.data()?.images?.at(0)?.url || ""}
					itemCount={album.data()?.tracks.total || 0}
					onAddToQueue={() => queue.addSpotifyAlbum(params.id)}
				/>
			</Show>

			<Divider extraClass="my-8" />

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
