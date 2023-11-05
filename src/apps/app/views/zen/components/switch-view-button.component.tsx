import { Button, Text } from "@common/components";
import { Component } from "solid-js";

type Props = {
	isShowTracks: boolean;
	onClick: () => void;
};

export const SwitchViewButton: Component<Props> = (props) => {
	return (
		<div class="flex w-full justify-end">
			<Button
				flat
				icon={"audioPlaylist"}
				onClick={() => props.onClick()}
				iconSize="sm"
				class="px-2 py-1 space-x-2 text-neutral-300"
			>
				<Text.Caption1 class="text-inherit">{props.isShowTracks ? "Hide Tracks" : "Show Tracks"}</Text.Caption1>
			</Button>
		</div>
	);
};
