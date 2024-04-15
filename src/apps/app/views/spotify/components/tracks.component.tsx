import { useApp } from "@app/hooks";
import { SectionList } from "@common";
import { MediaSource, MediaSourceContextMenuUtil, MediaSourceFactory } from "@media-source";
import { useQueue } from "@queue";
import { useSpotify } from "@spotify";
import { Show, type Component } from "solid-js";
import { RefreshButton } from "./refresh-button.component";

export const Tracks: Component = () => {
	const app = useApp();
	const spotify = useSpotify();
	const queue = useQueue();

	return (
		<div class="space-y-8">
			<Show when={spotify.currentlyPlaying.data()} keyed>
				{(currentlyPlaying) => (
					<SectionList
						label="Continue Listening"
						items={[MediaSourceFactory.fromSpotifyTrack(currentlyPlaying)]}
						skeletonCount={1}
						isLoading={spotify.currentlyPlaying.data.loading}
						rightTitle={() => (
							<RefreshButton
								disabled={spotify.currentlyPlaying.data.loading}
								onClick={spotify.currentlyPlaying.refetch}
							/>
						)}
					>
						{(mediaSource) => (
							<MediaSource.List
								mediaSource={mediaSource}
								inQueue={queue.data.tracks?.some((t) => t.mediaSource.id === mediaSource.id)}
								contextMenu={MediaSourceContextMenuUtil.getContextMenu({
									mediaSource,
									queueStore: queue,
									appStore: app,
								})}
							/>
						)}
					</SectionList>
				)}
			</Show>

			<Show when={spotify.topTracks.data()} keyed>
				{(topTracks) => (
					<SectionList
						label="Top Tracks"
						items={topTracks.map(MediaSourceFactory.fromSpotifyTrack)}
						isLoading={spotify.topTracks.data.loading}
						rightTitle={() => (
							<RefreshButton
								disabled={spotify.topTracks.data.loading}
								onClick={spotify.topTracks.refetch}
							/>
						)}
					>
						{(mediaSource) => (
							<MediaSource.List
								mediaSource={mediaSource}
								inQueue={queue.data.tracks?.some((t) => t.mediaSource.id === mediaSource.id)}
								contextMenu={MediaSourceContextMenuUtil.getContextMenu({
									mediaSource,
									queueStore: queue,
									appStore: app,
								})}
							/>
						)}
					</SectionList>
				)}
			</Show>

			<Show when={spotify.recentlyPlayed.data()} keyed>
				{(recentlyPlayed) => (
					<SectionList
						label="Recently Played"
						items={recentlyPlayed.map(MediaSourceFactory.fromSpotifyTrack)}
						isLoading={spotify.recentlyPlayed.data.loading}
						rightTitle={() => (
							<RefreshButton
								disabled={spotify.recentlyPlayed.data.loading}
								onClick={spotify.recentlyPlayed.refetch}
							/>
						)}
					>
						{(mediaSource) => (
							<MediaSource.List
								mediaSource={mediaSource}
								inQueue={queue.data.tracks?.some((t) => t.mediaSource.id === mediaSource.id)}
								contextMenu={MediaSourceContextMenuUtil.getContextMenu({
									mediaSource,
									queueStore: queue,
									appStore: app,
								})}
							/>
						)}
					</SectionList>
				)}
			</Show>
		</div>
	);
};
