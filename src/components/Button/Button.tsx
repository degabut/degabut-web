import { Icon, Icons, IconSize } from "@components/Icon";
import { Text } from "@components/Text";
import { Component, JSX, Show } from "solid-js";

type Props = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
	rounded?: boolean;
	flat?: boolean;
	icon?: Icons;
	iconSize?: IconSize;
};

export const Button: Component<Props> = (props) => {
	return (
		<button
			type="button"
			{...props}
			class="flex-row-center"
			classList={{
				"rounded-full": props.rounded,
				rounded: !props.rounded,
				"border border-neutral-400": !props.flat,
				"text-neutral-500": props.disabled,
				"hover:bg-white/[5%]": !props.disabled,
				"hover:text-white": !props.disabled && props.flat,
				"border-neutral-600 bg-white/5": props.disabled && !props.flat,
				...props.classList,
				[props.class || ""]: !!props.class,
			}}
		>
			<Show when={props.icon} keyed>
				{(icon) => <Icon name={icon} size={props.iconSize || "md"} class="fill-current shrink-0" />}
			</Show>

			<Show when={typeof props.children === "string"} fallback={props.children}>
				<Text.Body1>{props.children}</Text.Body1>
			</Show>
		</button>
	);
};
