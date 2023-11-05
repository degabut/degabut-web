import { Icon, RouterLink, Text } from "@common/components";
import { useMatch } from "@solidjs/router";
import { Component, For } from "solid-js";
import { Card } from "../../../components";

export const NavigationCard: Component = () => {
	const links = [
		{ icon: "degabutThin", label: "Queue", path: "/desktop-overlay/queue" },
		{ icon: "search", label: "Search", path: "/desktop-overlay/search" },
		{ icon: "heart", label: "For You", path: "/desktop-overlay/recommendation" },
	] as const;

	return (
		<div class="flex-col-center h-full space-y-4">
			<For each={links}>
				{(link) => {
					const isActive = useMatch(() => link.path);
					return (
						<RouterLink href={link.path} class="w-full">
							<Card
								extraClass="outline"
								extraClassList={{
									"outline-1 outline-neutral-200": !!isActive(),
									"outline-0 hover:outline-1 hover:outline-neutral-500": !isActive(),
								}}
							>
								<div class="flex-col-center space-y-3">
									<Icon name={link.icon} size="xl" extraClass="fill-current mx-auto" />
									<Text.H3>{link.label}</Text.H3>
								</div>
							</Card>
						</RouterLink>
					);
				}}
			</For>
		</div>
	);
};
