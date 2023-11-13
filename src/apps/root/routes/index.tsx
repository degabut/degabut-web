import { appRoutes } from "@app/routes";
import { desktopOverlayRoutes } from "@desktop-overlay/routes";
import { Navigate, RouteDefinition } from "@solidjs/router";

export const routes: RouteDefinition[] = [
	...appRoutes,
	...desktopOverlayRoutes,
	{ path: "*", component: () => <Navigate href="/queue" /> },
];
