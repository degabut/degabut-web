import { useRoutes } from "solid-app-router";
import { Component } from "solid-js";
import { IS_DESKTOP } from "../constants";
import { routes } from "../routes";

export const Main: Component = () => {
	const Routes = useRoutes(routes);

	if (IS_DESKTOP && import.meta.env.PROD) {
		document.addEventListener("contextmenu", (e) => e.preventDefault());
	}

	return <Routes />;
};
