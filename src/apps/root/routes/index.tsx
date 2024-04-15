import { AppRoutes, appRouteDefinitions } from "@app/routes";
import { ApiProvider, ContextMenuProvider, ScreenProvider } from "@common";
import { DesktopProvider } from "@desktop";
import { desktopOverlayRouteDefinitions } from "@desktop-overlay/routes";
import { DiscordProvider } from "@discord";
import { loginRouteDefinitions } from "@login/routes";
import { recapRouteDefinitions } from "@recap/routes";
import { SettingsProvider } from "@settings";
import { Navigate, type RouteDefinition } from "@solidjs/router";

export const routes: RouteDefinition[] = [
	{
		path: "/",
		component: (props) => (
			<ScreenProvider>
				<ContextMenuProvider>
					<ApiProvider>
						<DesktopProvider>
							<DiscordProvider>
								<SettingsProvider>{props.children}</SettingsProvider>
							</DiscordProvider>
						</DesktopProvider>
					</ApiProvider>
				</ContextMenuProvider>
			</ScreenProvider>
		),
		children: [
			...appRouteDefinitions,
			...loginRouteDefinitions,
			...desktopOverlayRouteDefinitions,
			...recapRouteDefinitions,
			{ path: "*", component: () => <Navigate href={AppRoutes.Queue} /> },
		],
	},
];
