import { JSX, ParentComponent } from "solid-js";

type Props = {
	right?: JSX.Element;
};

export const Title: ParentComponent<Props> = (props) => {
	return (
		<div class="flex flex-row justify-between items-end">
			<div class="text-xl font-medium">{props.children}</div>
			{props.right}
		</div>
	);
};
