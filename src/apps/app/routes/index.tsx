import { RouteDefinition } from "@solidjs/router";
import {
	App,
	Container,
	Join,
	Login,
	Lyrics,
	OAuth,
	PlaylistDetail,
	Playlists,
	Queue,
	QueueNowPlaying,
	Recommendation,
	Search,
	Settings,
	VideoDetail,
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
					{ path: "/video/:id", component: () => <VideoDetail /> },
					{ path: "/search", component: () => <Search /> },
					{ path: "/recommendation", component: () => <Recommendation /> },
					{ path: "/recommendation/:id?", component: () => <Recommendation /> },
					{ path: "/playlist", component: () => <Playlists /> },
					{ path: "/playlist/:id", component: () => <PlaylistDetail /> },
					{ path: "/settings", component: () => <Settings /> },
					{ path: "/join/:voiceChannelId?/:textChannelId?", component: () => <Join /> },
				],
			},
			{ path: "/login", component: () => <Login /> },
			{ path: "/oauth", component: () => <OAuth /> },
		],
	},
];
