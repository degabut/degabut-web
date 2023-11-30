import { RouteDefinition } from "@solidjs/router";
import { App, Recap } from "../views";

export const recapRoutes: RouteDefinition[] = [
	{
		path: "/recap",
		component: () => <App />,
		children: [{ path: "/:year?", component: () => <Recap /> }],
	},
];
