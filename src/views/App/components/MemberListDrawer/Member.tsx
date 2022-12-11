import { IMember } from "@api";
import { Icon, Icons } from "@components/Icon";
import { contextMenu } from "@directives/contextMenu";
import { Component, Show } from "solid-js";

contextMenu;

type HeaderProps = {
	member: IMember;
};

const Header: Component<HeaderProps> = (props) => {
	return (
		<div class="flex-row-center py-4  px-6 space-x-4">
			{props.member.avatar && <img src={props.member.avatar || ""} class="w-12 h-12 rounded-full" />}

			<div class="font-semibold">{props.member.displayName}</div>
		</div>
	);
};

type ItemProps = {
	icon: Icons;
	iconSize?: "md" | "lg";
	label: string;
};

const Item: Component<ItemProps> = (props) => {
	return (
		<div class="flex-row-center space-x-6 ">
			<Icon name={props.icon} size={props.iconSize} extraClass="fill-current text-neutral-400" />
			<div>{props.label}</div>
		</div>
	);
};

type Props = {
	member: IMember;
	minimized: boolean;
	onClickRecommendation: (member: IMember) => void;
};

export const Member: Component<Props> = (props) => {
	return (
		<div
			class="flex-row-center space-x-3 px-3 py-2 rounded cursor-pointer hover:bg-white/10"
			classList={{ "justify-center": props.minimized }}
			use:contextMenu={{
				header: () => <Header member={props.member} />,
				extraContainerClass: "bg-neutral-900",
				items: [
					[
						{
							element: () => <Item icon="heart" iconSize="lg" label="Recommendation" />,
							onClick: () => props.onClickRecommendation(props.member),
						},
					],
				],
				openWithClick: true,
			}}
		>
			<img src={props.member.avatar || "/img/avatar.png"} class="w-8 h-8 rounded-full" />
			<Show when={!props.minimized}>
				<div class="truncate">{props.member.displayName}</div>
			</Show>
		</div>
	);
};
