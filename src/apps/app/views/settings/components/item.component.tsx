import { Text } from "@common";
import { Show, type Accessor, type JSX, type ParentComponent } from "solid-js";

export type BaseProps = {
	label: string;
	type: string;
	disabled?: boolean;
	description?: string | (() => JSX.Element);
};

export type ValueProps<T> = BaseProps & {
	value: Accessor<T>;
	onChange?: (value: T) => void;
};

export const Item: ParentComponent<BaseProps> = (props) => {
	return (
		<div class="flex-row-center justify-between space-x-4">
			<div class="flex flex-col">
				<Text.Body1>{props.label}</Text.Body1>
				<Show when={props.description} keyed>
					{(description) =>
						typeof description === "function" ? description() : <Text.Caption1>{description}</Text.Caption1>
					}
				</Show>
			</div>
			<div class="shrink-0">{props.children}</div>
		</div>
	);
};
