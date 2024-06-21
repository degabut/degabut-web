import { Text, useShortcut } from "@common";
import { IS_DESKTOP } from "@constants";
import { DesktopOverlayRoutes } from "@desktop-overlay/routes";
import { useQueue } from "@queue";
import { Navigate, useBeforeLeave, useNavigate } from "@solidjs/router";
import { For, type ParentComponent } from "solid-js";
import { NavigationCard } from "./components";

export const Main: ParentComponent = (props) => {
	// eslint-disable-next-line solid/components-return-once
	if (!IS_DESKTOP) return <Navigate href="/" />;

	const queue = useQueue()!;
	const navigate = useNavigate();

	useShortcut({
		shortcuts: [
			{
				key: "k",
				ctrl: true,
				handler: () => navigate(DesktopOverlayRoutes.Search),
			},
		],
	});

	useBeforeLeave((e) => {
		if (!e.to.toString().startsWith("/desktop-overlay")) e.preventDefault();
	});

	const links = [
		{ icon: "degabutThin", label: "Queue", path: DesktopOverlayRoutes.Queue },
		{ icon: "search", label: "Search", path: DesktopOverlayRoutes.Search },
		{ icon: "heart", label: "For You", path: DesktopOverlayRoutes.Recommendation },
	] as const;

	return (
		<div class="flex-col-center space-y-6 h-full w-full bg-black/50">
			<div class="flex-row-center justify-center space-x-4 bg-black/90 w-full py-5">
				<img class="w-12 h-12" src={queue.bot().iconUrl} />
				<Text.H1 class="text-3xl font-brand font-black tracking-wide">{queue.bot().name}</Text.H1>
			</div>

			<div class="flex flex-row space-x-6 h-[32rem] max-w-[86rem] min-h-0 w-full p-2">
				<div class="flex-col-center h-full space-y-4">
					<For each={links}>{(link) => <NavigationCard {...link} />}</For>
				</div>

				<div class="grow">{props.children}</div>
			</div>
		</div>
	);
};
