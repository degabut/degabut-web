import { useApp } from "@app/hooks";
import { MediaSource } from "@media-source/components";
import { MediaSourceContextMenuUtil, MediaSourceFactory } from "@media-source/utils";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { SpotifyPlaylist } from "@spotify/components";
import { useSpotify } from "@spotify/hooks";
import { SpotifyContextMenuUtil } from "@spotify/utils/context-menu.util";
import { Component, Show, onMount } from "solid-js";
import { Container, SectionList, Title } from "./components";

export const Spotify: Component = () => {
	const spotify = useSpotify();

	return (
		<Show when={spotify.isConnected()}>
			<Content />
		</Show>
	);
};

const Content: Component = () => {
	const app = useApp();
	const spotify = useSpotify();
	const queue = useQueue();
	const navigate = useNavigate();

	onMount(() => app.setTitle("Spotify"));

	return (
		<div class="h-full overflow-y-auto flex flex-col lg:flex-row lg:space-x-2 lg:space-y-0 lg:bg-transparent bg-neutral-950 rounded-lg">
			<Container extraClass="space-y-8 w-full lg:max-w-md max-w-full">
				<Show when={spotify.playlists.data()} keyed>
					{(playlists) => (
						<SectionList inline={false} label="Your Playlists" items={playlists} isLoading={false}>
							{(playlist) => (
								<SpotifyPlaylist.List
									onClick={() => navigate("/spotify/playlist/" + playlist.id)}
									playlist={playlist}
									contextMenu={SpotifyContextMenuUtil.getPlaylistContextMenu({
										playlist,
										queueStore: queue,
										appStore: app,
									})}
								/>
							)}
						</SectionList>
					)}
				</Show>
			</Container>

			<Container extraClass="space-y-8 w-full">
				<Show when={spotify.queue.data()?.currentlyPlaying} keyed>
					{(currentlyPlaying) => {
						const mediaSource = MediaSourceFactory.fromSpotifyTrack(currentlyPlaying);

						return (
							<div class="space-y-6 lg:space-y-4">
								<Title>Continue Listening</Title>
								<MediaSource.List
									mediaSource={mediaSource}
									contextMenu={MediaSourceContextMenuUtil.getContextMenu({
										mediaSource,
										queueStore: queue,
										appStore: app,
									})}
								/>
							</div>
						);
					}}
				</Show>

				<Show when={spotify.topTracks.data()} keyed>
					{(topTracks) => (
						<SectionList
							label="Top Tracks"
							items={topTracks.map(MediaSourceFactory.fromSpotifyTrack)}
							isLoading={false}
						>
							{(mediaSource) => (
								<MediaSource.List
									mediaSource={mediaSource}
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
							isLoading={false}
						>
							{(mediaSource) => (
								<MediaSource.List
									mediaSource={mediaSource}
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
			</Container>
		</div>
	);
};
