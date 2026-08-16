import type { RouteDefinition, RouteSectionProps } from "@solidjs/router";
import { Main } from "../layout";
import { Login, OAuth, OAuthSpotify, OAuthYouTube } from "../views";

export enum LoginRoutes {
	Login = "/login",
	OAuth = "/oauth",
	OAuthSpotify = "/oauth/spotify",
	OAuthYoutube = "/oauth/youtube",
}

export const loginRouteDefinitions: RouteDefinition[] = [
	{
		path: "/",
		component: (props: RouteSectionProps) => <Main {...props} />,
		children: [
			{ path: LoginRoutes.Login, component: Login },
			{ path: LoginRoutes.OAuth, component: OAuth },
			{ path: LoginRoutes.OAuthSpotify, component: OAuthSpotify },
			{ path: LoginRoutes.OAuthYoutube, component: OAuthYouTube },
		],
	},
];
