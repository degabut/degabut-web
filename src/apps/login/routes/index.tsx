import type { RouteDefinition } from "@solidjs/router";
import { Main } from "../layout";
import { Login, OAuth } from "../views";

export enum LoginRoutes {
	Login = "/login",
	OAuth = "/oauth",
}

export const loginRouteDefinitions: RouteDefinition[] = [
	{
		path: "/",
		component: (props) => <Main {...props} />,
		children: [
			{ path: LoginRoutes.Login, component: Login },
			{ path: LoginRoutes.OAuth, component: OAuth },
		],
	},
];
