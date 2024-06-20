import { useScreen } from "@common";
import { DesktopContainer } from "@desktop";
import { useDiscord } from "@discord";
import { Match, Switch, type ParentComponent } from "solid-js";
import { DiscordActivityPip } from "./discord-activity-pip";
import { Main } from "./main";
import { MainMd } from "./main-md";

export * from "./main";

export const AppLayout: ParentComponent = (props) => {
	const discord = useDiscord();
	const screen = useScreen();

	return (
		<DesktopContainer>
			<Switch fallback={<Main {...props} />}>
				<Match when={discord?.isPip()}>
					<DiscordActivityPip />
				</Match>
				<Match when={screen.gte.md}>
					<MainMd {...props} />
				</Match>
			</Switch>
		</DesktopContainer>
	);
};
