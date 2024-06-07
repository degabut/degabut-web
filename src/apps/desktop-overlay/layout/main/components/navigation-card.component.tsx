import { A, Icon, Text, type Icons } from "@common";
import { useMatch } from "@solidjs/router";
import type { Component } from "solid-js";
import { Card } from "../../../components";

type NavigationCardProps = {
	label: string;
	icon: Icons;
	path: string;
};

export const NavigationCard: Component<NavigationCardProps> = (props) => {
	const isActive = useMatch(() => props.path);

	return (
		<A href={props.path} class="w-full">
			<Card
				extraClass="outline"
				extraClassList={{
					"outline-1 outline-neutral-200": !!isActive(),
					"outline-0 hover:outline-1 hover:outline-neutral-500": !isActive(),
				}}
			>
				<div class="flex-col-center space-y-3">
					<Icon name={props.icon} size="xl" extraClass="mx-auto" />
					<Text.H3>{props.label}</Text.H3>
				</div>
			</Card>
		</A>
	);
};
