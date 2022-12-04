import { Icon } from "@components/Icon";
import { Component } from "solid-js";

type Props = {
	onClick: () => void;
	disabled: boolean;
};

export const SkipButton: Component<Props> = (props) => {
	return (
		<button
			onClick={() => props.onClick()}
			class="p-2"
			title="Skip"
			disabled={props.disabled}
			classList={{
				"fill-neutral-600": props.disabled,
				"hover:fill-white fill-neutral-300": !props.disabled,
			}}
		>
			<Icon name="forward" extraClass="w-5 h-5" />
		</button>
	);
};
