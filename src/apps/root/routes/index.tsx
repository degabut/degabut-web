import { appRoutes } from "@app/routes";
import { desktopOverlayRoutes } from "@desktop-overlay/routes";
import { recapRoutes } from "@recap/routes";
import { Navigate, RouteDefinition } from "@solidjs/router";

export const routes: RouteDefinition[] = [
	...appRoutes,
	...desktopOverlayRoutes,
	...recapRoutes,
	{ path: "*", component: () => <Navigate href="/queue" /> },
];
