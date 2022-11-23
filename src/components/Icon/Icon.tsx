import { Component } from "solid-js";
import * as icons from "./icons";

export type Icons = keyof typeof icons;
export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

type Props = {
	name: Icons;
	size?: IconSize;
	extraClass?: string;
	extraClassList?: Record<string, boolean>;
};

export const Icon: Component<Props> = (props) => {
	return (
		<svg
			class={props.extraClass}
			classList={{
				"w-2 h-2": props.size === "xs",
				"w-3 h-3": props.size === "sm",
				"w-4 h-4": props.size === "md",
				"w-5 h-5": props.size === "lg",
				"w-6 h-6": props.size === "xl",
				"w-8 h-8": props.size === "2xl",
				"w-10 h-10": props.size === "3xl",
				...props.extraClassList,
			}}
			// eslint-disable-next-line solid/no-innerhtml
			innerHTML={icons[props.name]}
		/>
	);
};
