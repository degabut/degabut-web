import { Text } from "@common/components";
import { Accessor, JSX, ParentComponent } from "solid-js";

type TitleProps = {
	right?: Accessor<JSX.Element>;
};

export const Title: ParentComponent<TitleProps> = (props) => {
	return (
		<div class="flex flex-row justify-between items-end">
			<Text.H2 class="text-xl font-medium">{props.children}</Text.H2>
			{props.right?.()}
		</div>
	);
};
