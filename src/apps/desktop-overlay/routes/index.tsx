import { Navigate, RouteDefinition } from "@solidjs/router";
import { App, Queue, Recommendation, Search } from "../views";

export const desktopOverlayRoutes: RouteDefinition[] = [
	{
		path: "/desktop-overlay/*",
		component: () => <Navigate href="/desktop-overlay/queue" />,
	},
	{
		path: "/desktop-overlay",
		component: () => <App />,
		children: [
			{ path: "/queue", component: () => <Queue /> },
			{ path: "/search", component: () => <Search /> },
			{ path: "/recommendation", component: () => <Recommendation /> },
			{ path: "*", component: () => <Navigate href="/desktop-overlay/queue" /> },
		],
	},
];
