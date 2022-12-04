import { App } from "@views/App";
import { Join } from "@views/Join";
import { Login } from "@views/Login";
import { Lyric } from "@views/Lyric";
import { OAuth } from "@views/OAuth";
import { PlaylistDetail } from "@views/PlaylistDetail";
import { Playlists } from "@views/Playlists";
import { Queue } from "@views/Queue";
import { Recommendation } from "@views/Recommendation";
import { Search } from "@views/Search";
import { Settings } from "@views/Settings";
import { VideoDetail } from "@views/VideoDetail";
import { Navigate } from "solid-app-router";
import { RouteDefinition } from "solid-app-router/dist/types";

const Default = () => <Navigate href="/app/queue" />;

export const routes: RouteDefinition[] = [
	{ path: "/", component: Default },
	{ path: "/login", component: () => <Login /> },
	{ path: "/oauth", component: () => <OAuth /> },
	{
		path: "/app",
		component: () => <App />,
		children: [
			{ path: "/", component: Default },
			{ path: "/queue", component: () => <Queue /> },
			{ path: "/join/:id", component: () => <Join /> },
			{ path: "/queue/lyric", component: () => <Lyric /> },
			{ path: "/video/:id", component: () => <VideoDetail /> },
			{ path: "/recommendation", component: () => <Recommendation /> },
			{ path: "/recommendation/:id?", component: () => <Recommendation /> },
			{ path: "/playlist", component: () => <Playlists /> },
			{ path: "/playlist/:id", component: () => <PlaylistDetail /> },
			{ path: "/search", component: () => <Search /> },
			{ path: "/settings", component: () => <Settings /> },
		],
	},
	{
		path: "*",
		component: Default,
	},
];
