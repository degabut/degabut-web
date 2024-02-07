import { RouteDefinition } from "@solidjs/router";
import {
	App,
	Container,
	Join,
	Login,
	Lyrics,
	OAuth,
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
	SpotifyPlaylist,
} from "../views";

export const appRoutes: RouteDefinition[] = [
	{
		path: "/",
		component: () => <Container />,
		children: [
			{
				path: "/",
				component: () => <App />,
				children: [
					{ path: "/queue", component: () => <Queue /> },
					{ path: "/queue/player", component: () => <QueueNowPlaying /> },
					{ path: "/queue/lyrics", component: () => <Lyrics /> },
					{ path: "/search", component: () => <Search /> },
					{ path: "/recommendation", component: () => <Recommendation /> },
					{ path: "/recommendation/:id?", component: () => <Recommendation /> },
					{ path: "/spotify", component: () => <Spotify /> },
					{ path: "/spotify/playlist/:id", component: () => <SpotifyPlaylist /> },
					{ path: "/playlist", component: () => <Playlists /> },
					{ path: "/playlist/:id", component: () => <PlaylistDetail /> },
					{
						path: "/settings",
						children: [
							{ path: "/", component: () => <Settings /> },
							{ path: "/rich-presence", component: () => <RichPresenceEditor /> },
						],
					},
					{ path: "/oauth/spotify", component: () => <OAuthSpotify /> },
					{ path: "/join/:voiceChannelId?/:textChannelId?", component: () => <Join /> },
				],
			},
			{ path: "/login", component: () => <Login /> },
			{ path: "/oauth", component: () => <OAuth /> },
		],
	},
];
