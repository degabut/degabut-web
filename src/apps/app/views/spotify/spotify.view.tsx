import { useApp } from "@app/hooks";
import { MediaSource } from "@media-source/components";
import { MediaSourceContextMenuUtil, MediaSourceFactory } from "@media-source/utils";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { SpotifyPlaylist } from "@spotify/components";
import { useSpotify } from "@spotify/hooks";
import { SpotifyContextMenuUtil } from "@spotify/utils/context-menu.util";
import { Component, ParentComponent, Show } from "solid-js";
import { SectionList, Title } from "./components";

type ContainerProps = {
	extraClass?: string;
};

const Container: ParentComponent<ContainerProps> = (props) => {
	return (
		<div
			class="h-full md:overflow-y-auto bg-neutral-950 md:rounded-lg px-3 md:px-6 md:py-8"
			classList={{ [props.extraClass || ""]: !!props.extraClass }}
		>
			{props.children}
		</div>
	);
};

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

	return (
		<div class="flex flex-col md:flex-row md:space-x-2 space-y-8 h-full">
			<Container extraClass="w-full md:max-w-sm">
				<Show when={spotify.playlists.data()} keyed>
					{(playlists) => (
						<SectionList label="Your Playlists" inline={false} items={playlists} isLoading={false}>
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

			<Container extraClass="w-full">
				<Show when={spotify.queue.data()?.currentlyPlaying} keyed>
					{(currentlyPlaying) => {
						const mediaSource = MediaSourceFactory.fromSpotifyTrack(currentlyPlaying);

						return (
							<div class="space-y-6 md:space-y-4">
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

				<div class="w-full space-y-8">
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
				</div>
			</Container>
		</div>
	);
};
