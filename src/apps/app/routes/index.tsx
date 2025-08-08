import { Filters } from "@app/views/filters";
import { NotificationProvider } from "@common";
import { MediaSourceLikeManagerProvider } from "@media-source";
import { QueueProvider } from "@queue";
import type { RouteDefinition } from "@solidjs/router";
import { LibraryProvider } from "@user";
import { AppLayout } from "../layout";
import { AppProvider, ErrorBoundaryProvider } from "../providers";
import {
	Join,
	Liked,
	Lyrics,
	OAuthSpotify,
	PlaylistDetail,
	Playlists,
	Queue,
	QueueNowPlaying,
	Recommendation,
	RichPresenceEditor,
	Search,
	Settings,
	Spotify,
	SpotifyAlbumDetail,
	SpotifyLiked,
	SpotifyPlaylistDetail,
} from "../views";

export enum AppRoutes {
	Queue = "/queue",
	Player = "/queue/player",
	Filters = "/queue/filters",
	Lyrics = "/queue/lyrics",
	Liked = "/liked",
	Recommendation = "/recommendation/:id?",
	Spotify = "/spotify",
	SpotifyLiked = "/spotify/liked",
	SpotifyPlaylist = "/spotify/playlist/:id",
	SpotifyAlbum = "/spotify/album/:id",
	Playlists = "/playlist",
	PlaylistDetail = "/playlist/:id",
	Settings = "/settings",
	RichPresence = "/settings/rich-presence",
	Search = "/search",
	Join = "/join/:voiceChannelId?/:textChannelId?",
	OAuthSpotify = "/oauth/spotify",
}

export const appRouteDefinitions: RouteDefinition[] = [
	{
		path: "/",
		component: (props) => (
			<ErrorBoundaryProvider>
				<NotificationProvider>
					<QueueProvider>
						<MediaSourceLikeManagerProvider>
							<AppProvider>
								<LibraryProvider>
									<AppLayout {...props} />
								</LibraryProvider>
							</AppProvider>
						</MediaSourceLikeManagerProvider>
					</QueueProvider>
				</NotificationProvider>
			</ErrorBoundaryProvider>
		),
		children: [
			{ path: AppRoutes.Queue, component: Queue },
			{ path: AppRoutes.Player, component: QueueNowPlaying },
			{ path: AppRoutes.Lyrics, component: Lyrics },
			{ path: AppRoutes.Filters, component: Filters },
			{ path: AppRoutes.Liked, component: Liked },
			{ path: AppRoutes.Recommendation, component: Recommendation },
			{ path: AppRoutes.Spotify, component: Spotify },
			{ path: AppRoutes.SpotifyLiked, component: SpotifyLiked },
			{ path: AppRoutes.SpotifyPlaylist, component: SpotifyPlaylistDetail },
			{ path: AppRoutes.SpotifyAlbum, component: SpotifyAlbumDetail },
			{ path: AppRoutes.Playlists, component: Playlists },
			{ path: AppRoutes.PlaylistDetail, component: PlaylistDetail },
			{ path: AppRoutes.Settings, component: Settings },
			{ path: AppRoutes.RichPresence, component: RichPresenceEditor },
			{ path: AppRoutes.Search, component: Search },
			{ path: AppRoutes.Join, component: Join },
			{ path: AppRoutes.OAuthSpotify, component: OAuthSpotify },
		],
	},
];
