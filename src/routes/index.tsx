import { Navigate, RouteDefinition } from "@solidjs/router";
import { App } from "@views/App";
import { DesktopOverlay, DesktopOverlayQueue, DesktopOverlayRecommendation } from "@views/DesktopOverlay";
import { Join } from "@views/Join";
import { Login } from "@views/Login";
import { Lyrics } from "@views/Lyrics";
import { OAuth } from "@views/OAuth";
import { PlaylistDetail } from "@views/PlaylistDetail";
import { Playlists } from "@views/Playlists";
import { Queue } from "@views/Queue";
import { Recommendation } from "@views/Recommendation";
import { Search } from "@views/Search";
import { Settings } from "@views/Settings";
import { VideoDetail } from "@views/VideoDetail";
import { Zen } from "@views/Zen";

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
			{ path: "/queue/lyrics", component: () => <Lyrics /> },
			{ path: "/queue/zen", component: () => <Zen /> },
			{ path: "/join/:id", component: () => <Join /> },
			{ path: "/video/:id", component: () => <VideoDetail /> },
			{ path: "/recommendation", component: () => <Recommendation /> },
			{ path: "/recommendation/:id?", component: () => <Recommendation /> },
			{ path: "/playlist", component: () => <Playlists /> },
			{ path: "/playlist/:id", component: () => <PlaylistDetail /> },
			{ path: "/search", component: () => <Search /> },
			{ path: "/settings", component: () => <Settings /> },
			{
				path: "/desktop-overlay",
				component: () => <DesktopOverlay />,
				children: [
					{ path: "/queue", component: () => <DesktopOverlayQueue /> },
					{ path: "/recommendation", component: () => <DesktopOverlayRecommendation /> },
					{ path: "*", component: () => <Navigate href="/app/desktop-overlay/queue" /> },
				],
			},
		],
	},
	{
		path: "*",
		component: Default,
	},
];
