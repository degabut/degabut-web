import { Navigate, RouteDefinition } from "@solidjs/router";
import {
	App,
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
	Zen,
} from "../views";

export const appRoutes: RouteDefinition[] = [
	{
		path: "/app",
		component: () => <App />,
		children: [
			{ path: "/", component: () => <Navigate href="/app/queue" /> },
			{ path: "/queue", component: () => <Queue /> },
			{ path: "/queue/player", component: () => <QueueNowPlaying /> },
			{ path: "/queue/lyrics", component: () => <Lyrics /> },
			{ path: "/queue/zen", component: () => <Zen /> },
			{ path: "/video/:id", component: () => <VideoDetail /> },
			{ path: "/search", component: () => <Search /> },
			{ path: "/recommendation", component: () => <Recommendation /> },
			{ path: "/recommendation/:id?", component: () => <Recommendation /> },
			{ path: "/playlist", component: () => <Playlists /> },
			{ path: "/playlist/:id", component: () => <PlaylistDetail /> },
			{ path: "/settings", component: () => <Settings /> },
		],
	},
	{ path: "/login", component: () => <Login /> },
	{ path: "/oauth", component: () => <OAuth /> },
];
