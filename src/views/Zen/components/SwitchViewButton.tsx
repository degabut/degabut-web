import { Button } from "@components/Button";
import { Text } from "@components/Text";
import { Component } from "solid-js";

type Props = {
	isShowPlayer: boolean;
	onClick: () => void;
};

export const SwitchViewButton: Component<Props> = (props) => {
	return (
		<div class="2xl:hidden flex w-full justify-end">
			<Button
				flat
				icon={props.isShowPlayer ? "audioPlaylist" : "musicNote"}
				onClick={() => props.onClick()}
				iconSize="sm"
				class="px-2 py-1 space-x-2 text-neutral-400"
			>
				<Text.Caption1 class="text-inherit">{props.isShowPlayer ? "Tracks" : "Player"}</Text.Caption1>
			</Button>
		</div>
	);
};
