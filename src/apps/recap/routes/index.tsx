import { Recap } from "@recap/views";
import type { RouteDefinition } from "@solidjs/router";

export enum RecapRoutes {
	Recap = "/recap/:year?",
}

export const recapRouteDefinitions: RouteDefinition[] = [
	{
		path: RecapRoutes.Recap,
		component: Recap,
	},
];
