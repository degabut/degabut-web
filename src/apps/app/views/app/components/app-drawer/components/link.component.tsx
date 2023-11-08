import { Button, Icons, RouterLink } from "@common/components";
import { useMatch } from "@solidjs/router";
import { Component, Show } from "solid-js";

type Props = {
	icon: Icons;
	label: string;
	path?: string;
	minimized: boolean;
	onClick: () => void;
};

const LinkButton: Component<Props & { isActive?: boolean }> = (props) => {
	return (
		<Button
			flat
			icon={props.icon}
			title={props.minimized ? props.label : undefined}
			iconSize="lg"
			class="w-full space-x-4 px-4 py-3.5 md:py-2.5"
			classList={{
				"text-neutral-400 fill-neutral-400 hover:text-neutral-400": !props.isActive,
				"fill-current font-medium": props.isActive,
				"justify-center !py-3.5": props.minimized,
			}}
		>
			<Show when={!props.minimized}>
				<div class="truncate">{props.label}</div>
			</Show>
		</Button>
	);
};

export const Link: Component<Props> = (props) => {
	return (
		<div class="relative px-2">
			<Show when={props.path} keyed fallback={<LinkButton {...props} />}>
				{(path) => {
					const isActive = useMatch(() => path);
					return (
						<RouterLink href={path} onClick={() => props.onClick()}>
							<div
								classList={{
									"absolute border-r-2 border-neutral-400 rounded-full left-0 h-full": !!isActive(),
								}}
							/>
							<LinkButton {...props} isActive={!!isActive()} />
						</RouterLink>
					);
				}}
			</Show>
		</div>
	);
};
