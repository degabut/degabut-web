import { AppRoutes, appRouteDefinitions } from "@app/routes";
import {
	ApiProvider,
	ContextMenuProvider,
	GlobalShortcutProvider,
	NotificationProvider,
	ScreenProvider,
} from "@common";
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
						<NotificationProvider>
							<DesktopProvider>
								<SettingsProvider>
									<ApiProvider>
										<SpotifyProvider>
											<DiscordProvider>{props.children}</DiscordProvider>
										</SpotifyProvider>
									</ApiProvider>
								</SettingsProvider>
							</DesktopProvider>
						</NotificationProvider>
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
