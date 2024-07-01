import { MediaSourceLikeManagerProvider } from "@media-source";
import { QueueProvider } from "@queue";
import { Navigate, type RouteDefinition } from "@solidjs/router";
import { DesktopOverlayLayout } from "../layout";
import { Queue, Recommendation, Search } from "../views";

export enum DesktopOverlayRoutes {
	Queue = "/desktop-overlay/queue",
	Search = "/desktop-overlay/search",
	Recommendation = "/desktop-overlay/recommendation",
}

export const desktopOverlayRouteDefinitions: RouteDefinition[] = [
	{
		path: "/",
		component: (props) => (
			<MediaSourceLikeManagerProvider>
				<QueueProvider>
					<DesktopOverlayLayout {...props} />
				</QueueProvider>
			</MediaSourceLikeManagerProvider>
		),
		children: [
			{
				path: "/desktop-overlay/*",
				component: () => <Navigate href={DesktopOverlayRoutes.Queue} />,
			},
			{ path: DesktopOverlayRoutes.Queue, component: Queue },
			{ path: DesktopOverlayRoutes.Search, component: Search },
			{ path: DesktopOverlayRoutes.Recommendation, component: Recommendation },
		],
	},
];
