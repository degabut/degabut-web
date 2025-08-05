import { Text } from "@common";
import { Show, type Accessor, type JSX, type ParentComponent } from "solid-js";

export type BaseProps = {
	label: string;
	vertical?: boolean;
	disabled?: boolean;
	description?: string | (() => JSX.Element);
};

export type ValueProps<T> = BaseProps & {
	value: Accessor<T>;
	onInput?: (value: T) => void;
};

export const Item: ParentComponent<BaseProps> = (props) => {
	return (
		<div
			class="flex justify-between"
			classList={{
				"flex-col md:flex-row md:space-x-4 md:items-center": !props.vertical,
				"flex-col items-center": props.vertical,
			}}
		>
			<div class="flex flex-col" classList={{ "order-last py-2.5": props.vertical }}>
				<Text.Body1>{props.label}</Text.Body1>
				<Show when={props.description} keyed>
					{(description) =>
						typeof description === "function" ? description() : <Text.Caption1>{description}</Text.Caption1>
					}
				</Show>
			</div>

			{props.children}
		</div>
	);
};
