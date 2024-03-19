import { RouteDefinition } from "@solidjs/router";
import { Recap } from "../views";

export const recapRoutes: RouteDefinition[] = [
	{
		path: "/recap",
		children: [{ path: "/:year?", component: () => <Recap /> }],
	},
];
