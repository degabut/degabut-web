import { ApiProvider, ContextMenuProvider, ScreenProvider } from "@common/providers";
import { IS_DESKTOP, PROD } from "@constants";
import { DesktopProvider } from "@desktop/providers";
import { SettingsProvider } from "@settings/providers";
import { useRoutes } from "@solidjs/router";
import { Component } from "solid-js";
import { routes } from "../routes";

export const Root: Component = () => {
	const Routes = useRoutes(routes);

	if (IS_DESKTOP && PROD) {
		document.addEventListener("contextmenu", (e) => e.preventDefault());
	}

	return (
		<ScreenProvider>
			<ContextMenuProvider>
				<DesktopProvider>
					<ApiProvider>
						<SettingsProvider>
							<Routes />
						</SettingsProvider>
					</ApiProvider>
				</DesktopProvider>
			</ContextMenuProvider>
		</ScreenProvider>
	);
};
