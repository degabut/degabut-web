import { RouterLink } from "@components/A";
import { Button } from "@components/Button";
import { Icons } from "@components/Icon";
import { useMatch } from "solid-app-router";
import { Component, Show } from "solid-js";

type Props = {
	icon: Icons;
	label: string;
	path: string;
	minimized: boolean;
	onClick: () => void;
};

export const Link: Component<Props> = (props) => {
	const isActive = useMatch(() => props.path);

	return (
		<RouterLink href={props.path} onClick={() => props.onClick()}>
			<Button
				flat
				icon={props.icon}
				title={props.minimized ? props.label : undefined}
				iconSize="lg"
				class="w-full space-x-4 px-4 py-3.5 md:py-2.5"
				classList={{
					"text-neutral-400 fill-neutral-400 hover:text-neutral-400": !isActive(),
					"bg-white/[7.5%] hover:bg-white/[7.5%] fill-current font-medium": !!isActive(),
					"justify-center !py-3.5": props.minimized,
				}}
			>
				<Show when={!props.minimized}>
					<div class="truncate">{props.label}</div>
				</Show>
			</Button>
		</RouterLink>
	);
};
