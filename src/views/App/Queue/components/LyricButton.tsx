import { Icon } from "@components/Icon";
import { Component } from "solid-js";

type Props = {
	onClick: () => void;
};

export const LyricButton: Component<Props> = (props) => {
	return (
		<button onClick={() => props.onClick()} class="p-2 hover:fill-white fill-neutral-300" title="Lyric">
			<Icon name="microphone" extraClass="w-5 h-5" />
		</button>
	);
};