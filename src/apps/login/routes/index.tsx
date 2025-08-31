import type { RouteDefinition } from "@solidjs/router";
import { Main } from "../layout";
import { Login, OAuth, OAuthSpotify } from "../views";

export enum LoginRoutes {
	Login = "/login",
	OAuth = "/oauth",
	OAuthSpotify = "/oauth/spotify",
}

export const loginRouteDefinitions: RouteDefinition[] = [
	{
		path: "/",
		component: (props) => <Main {...props} />,
		children: [
			{ path: LoginRoutes.Login, component: Login },
			{ path: LoginRoutes.OAuth, component: OAuth },
			{ path: LoginRoutes.OAuthSpotify, component: OAuthSpotify },
		],
	},
];
