import { useApp } from "@app/hooks";
import { Container, Text } from "@common/components";
import { useInfiniteScrolling } from "@common/hooks";
import { MediaSources } from "@media-source/components";
import { MediaSourceContextMenuUtil, MediaSourceFactory } from "@media-source/utils";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { useSpotifySelfTracks } from "@spotify/hooks";
import { Component, createEffect } from "solid-js";

export const SpotifyLiked: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();
	let containerRef!: HTMLDivElement;

	const tracks = useSpotifySelfTracks({
		onLoad: () => infinite.load(),
	});
	const infinite = useInfiniteScrolling({
		callback: tracks.next,
		container: () => containerRef,
		disabled: () => !tracks.isFetchable(),
	});

	createEffect(() => {
		app.setTitle("Liked Tracks");
	});

	return (
		<Container size="md" extraClass="space-y-4" ref={containerRef}>
			<Text.H2 class="text-xl font-medium">Liked Tracks</Text.H2>

			<MediaSources.List
				data={tracks.data}
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
							navigate,
						}),
					};
				}}
			/>
		</Container>
	);
};
