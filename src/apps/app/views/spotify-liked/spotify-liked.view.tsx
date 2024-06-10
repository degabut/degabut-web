import { useApp } from "@app/hooks";
import { Container, Text, useInfiniteScrolling } from "@common";
import { MediaSourceFactory, MediaSources } from "@media-source";
import { useQueue } from "@queue";
import { useSpotifySelfTracks } from "@spotify";
import { createEffect, type Component } from "solid-js";

export const SpotifyLiked: Component = () => {
	const app = useApp();
	const queue = useQueue();
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
					};
				}}
			/>
		</Container>
	);
};
