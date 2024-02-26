import { useApp } from "@app/hooks";
import { Button, Icon, Item, RouterLink, SectionList, Text } from "@common/components";
import { SPOTIFY_CLIENT_ID } from "@constants";
import { MediaSource } from "@media-source/components";
import { MediaSourceContextMenuUtil, MediaSourceFactory } from "@media-source/utils";
import { useQueue } from "@queue/hooks";
import { useSettings } from "@settings/hooks";
import { useNavigate } from "@solidjs/router";
import { SpotifyAlbum, SpotifyPlaylist } from "@spotify/components";
import { useSpotify } from "@spotify/hooks";
import { SpotifyContextMenuUtil } from "@spotify/utils/context-menu.util";
import { Component, Show, onMount } from "solid-js";
import { Container, RefreshButton } from "./components";

export const Spotify: Component = () => {
	const spotify = useSpotify();
	const { settings } = useSettings();

	return (
		<Show when={!spotify.isConnected()} fallback={<Content />}>
			<Container extraClass="flex-col-center justify-center h-full space-y-12">
				<Icon name="spotify" size="4xl" class="fill-neutral-700" />

				<div class="flex-col-center space-y-4 text-center">
					<Show
						when={!SPOTIFY_CLIENT_ID && !settings["spotify.clientId"]}
						fallback={
							<>
								<Button rounded class="px-8 py-2.5" onClick={spotify.authenticate}>
									<Text.Body1>Authenticate</Text.Body1>
								</Button>
							</>
						}
					>
						<Text.H1>Client ID is not set up</Text.H1>
						<Text.Body1>
							Set up on{" "}
							<RouterLink class="underline underline-offset-2" href="/settings">
								settings
							</RouterLink>{" "}
							page
						</Text.Body1>
					</Show>
				</div>
			</Container>
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
				<Show when={spotify.playlists.data() || spotify.albums.data()} keyed>
					<SectionList
						inline={false}
						label="Library"
						items={[...(spotify.albums.data() || []), ...(spotify.playlists.data() || [])]}
						skeletonCount={5}
						isLoading={spotify.playlists.data.loading || spotify.albums.data.loading}
						rightTitle={() => (
							<RefreshButton
								disabled={spotify.playlists.data.loading || spotify.albums.data.loading}
								onClick={() => {
									spotify.playlists.refetch();
									spotify.albums.refetch();
								}}
							/>
						)}
						firstElement={() => (
							<Item.Hint
								label={() => <Text.Body1 truncate>Liked Tracks</Text.Body1>}
								icon="heartLine"
								onClick={() => navigate("/spotify/liked")}
							/>
						)}
					>
						{(item) =>
							item.type === "playlist" ? (
								<SpotifyPlaylist.List
									onClick={() => navigate("/spotify/playlist/" + item.id)}
									playlist={item}
									contextMenu={SpotifyContextMenuUtil.getPlaylistContextMenu({
										playlist: item,
										queueStore: queue,
										appStore: app,
									})}
								/>
							) : (
								<SpotifyAlbum.List
									onClick={() => navigate("/spotify/album/" + item.id)}
									album={item}
									contextMenu={SpotifyContextMenuUtil.getAlbumContextMenu({
										album: item,
										queueStore: queue,
										appStore: app,
									})}
								/>
							)
						}
					</SectionList>
				</Show>
			</Container>

			<Container extraClass="space-y-8 w-full">
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
			</Container>
		</div>
	);
};
