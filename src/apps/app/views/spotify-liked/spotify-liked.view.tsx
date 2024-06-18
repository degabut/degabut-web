import { useApp } from "@app/hooks";
import { Container, Icon, ItemDetails } from "@common";
import { MediaSourceFactory, MediaSources } from "@media-source";
import { useQueue } from "@queue";
import { useSpotifySelfTracks } from "@spotify";
import { createEffect, type Component } from "solid-js";

export const SpotifyLiked: Component = () => {
	const app = useApp();
	const queue = useQueue();

	const tracks = useSpotifySelfTracks();

	createEffect(() => {
		app.setTitle("Liked Tracks");
	});

	return (
		<Container size="md">
			<ItemDetails
				title="Liked Songs"
				image={() => (
					<div class="w-24 md:w-32 aspect-square flex-col-center justify-center border border-neutral-600 rounded">
						<Icon name="heartLine" size="3xl" class="text-neutral-500" />
					</div>
				)}
				infiniteCallback={tracks.next}
				isInfiniteDisabled={!tracks.isFetchable()}
			>
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
			</ItemDetails>
		</Container>
	);
};
