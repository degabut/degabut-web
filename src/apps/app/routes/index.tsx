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
	SpotifyLiked,
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
					{
						path: "/queue",
						children: [
							{ path: "/", component: () => <Queue /> },
							{ path: "/player", component: () => <QueueNowPlaying /> },
							{ path: "/lyrics", component: () => <Lyrics /> },
						],
					},
					{
						path: "/recommendation",
						children: [
							{ path: "/", component: () => <Recommendation /> },
							{ path: "/:id?", component: () => <Recommendation /> },
						],
					},
					{
						path: "/spotify",
						children: [
							{ path: "/", component: () => <Spotify /> },
							{ path: "/liked", component: () => <SpotifyLiked /> },
							{ path: "/playlist/:id", component: () => <SpotifyPlaylist /> },
						],
					},
					{
						path: "/playlist",
						children: [
							{ path: "/", component: () => <Playlists /> },
							{ path: "/:id", component: () => <PlaylistDetail /> },
						],
					},
					{
						path: "/settings",
						children: [
							{ path: "/", component: () => <Settings /> },
							{ path: "/rich-presence", component: () => <RichPresenceEditor /> },
						],
					},
					{ path: "/search", component: () => <Search /> },
					{ path: "/join/:voiceChannelId?/:textChannelId?", component: () => <Join /> },
					{ path: "/oauth/spotify", component: () => <OAuthSpotify /> },
				],
			},
			{ path: "/login", component: () => <Login /> },
			{ path: "/oauth", component: () => <OAuth /> },
		],
	},
];
