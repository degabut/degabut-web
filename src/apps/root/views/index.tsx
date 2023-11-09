import { ApiProvider, ContextMenuProvider, ScreenProvider } from "@common/providers";
import { IS_DESKTOP } from "@constants";
import { useRoutes } from "@solidjs/router";
import { Component } from "solid-js";
import { routes } from "../routes";

export const Root: Component = () => {
	const Routes = useRoutes(routes);

	if (IS_DESKTOP && import.meta.env.PROD) {
		document.addEventListener("contextmenu", (e) => e.preventDefault());
	}

	return (
		<ScreenProvider>
			<ContextMenuProvider>
				<ApiProvider>
					<Routes />
				</ApiProvider>
			</ContextMenuProvider>
		</ScreenProvider>
	);
};
