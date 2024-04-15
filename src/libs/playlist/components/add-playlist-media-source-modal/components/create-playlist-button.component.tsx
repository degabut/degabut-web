import { Icon } from "@common";
import type { Component } from "solid-js";

type Props = {
	onClick: () => void;
};

export const CreatePlaylistButton: Component<Props> = (props) => {
	return (
		<button
			onClick={() => props.onClick()}
			class="w-full h-[3.625rem] border-2 border-dashed border-neutral-600 hover:border-neutral-500 hover:bg-white/5 rounded"
		>
			<div class="flex-row-center space-x-2 px-3">
				<Icon name="plus" size="md" extraClass="fill-neutral-400" />
				<div>Create New Playlist</div>
			</div>
		</button>
	);
};
