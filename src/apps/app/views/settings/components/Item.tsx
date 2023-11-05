import { Text } from "@common/components";
import { Accessor, ParentComponent } from "solid-js";

export type BaseProps = {
	label: string;
	type: string;
	description?: string;
};

export type ValueProps<T> = BaseProps & {
	value: Accessor<T>;
	onChange: (value: T) => void;
};

export const Item: ParentComponent<BaseProps> = (props) => {
	return (
		<div class="flex-row-center justify-between space-x-4">
			<div class="flex flex-col">
				<Text.Body1>{props.label}</Text.Body1>
				<Text.Caption1>{props.description}</Text.Caption1>
			</div>
			{props.children}
		</div>
	);
};
