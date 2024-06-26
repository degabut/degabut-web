import { AppRoutes, appRouteDefinitions } from "@app/routes";
import { ApiProvider, ContextMenuProvider, GlobalShortcutProvider, ScreenProvider } from "@common";
import { DesktopProvider } from "@desktop";
import { desktopOverlayRouteDefinitions } from "@desktop-overlay/routes";
import { DiscordProvider } from "@discord";
import { loginRouteDefinitions } from "@login/routes";
import { recapRouteDefinitions } from "@recap/routes";
import { SettingsProvider } from "@settings";
import { Navigate, type RouteDefinition } from "@solidjs/router";
import { SpotifyProvider } from "@spotify";

export const routes: RouteDefinition[] = [
	{
		path: "/",
		component: (props) => (
			<ScreenProvider>
				<ContextMenuProvider>
					<GlobalShortcutProvider>
						<ApiProvider>
							<DesktopProvider>
								<SettingsProvider>
									<DiscordProvider>
										<SpotifyProvider>{props.children}</SpotifyProvider>
									</DiscordProvider>
								</SettingsProvider>
							</DesktopProvider>
						</ApiProvider>
					</GlobalShortcutProvider>
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
