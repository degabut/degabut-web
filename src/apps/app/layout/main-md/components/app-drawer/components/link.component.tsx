import { Button, useNavigate, type Icons } from "@common";
import { useMatch } from "@solidjs/router";
import { Show, type Component } from "solid-js";

type Props = {
	icon: Icons;
	activeIcon?: Icons;
	label: string;
	highlight?: boolean;
	path?: string;
	minimized: boolean;
	onClick: () => void;
};

export const Link: Component<Props> = (props) => {
	const navigate = useNavigate();
	const isActive = useMatch(() => props.path || "");

	const onClick = () => {
		if (props.path) navigate(props.path);
		props.onClick();
	};

	return (
		<div class="relative px-2">
			<Show when={isActive()}>
				<div class="absolute border-r-2 border-neutral-400 rounded-full left-0 h-full" />
			</Show>

			<Button
				flat
				icon={props.activeIcon && isActive() ? props.activeIcon : props.icon}
				title={props.minimized ? props.label : undefined}
				iconSize="lg"
				class="w-full space-x-4 px-4 py-3.5 md:py-2.5"
				classList={{
					"text-neutral-400": !isActive() && !props.highlight,
					"font-medium": !!isActive(),
					"text-brand-600 hover:!text-brand-600": props.highlight,
					"justify-center !py-3.5": props.minimized,
				}}
				onClick={onClick}
			>
				<Show when={!props.minimized}>
					<div class="truncate">{props.label}</div>
				</Show>
			</Button>
		</div>
	);
};
