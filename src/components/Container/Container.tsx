import { ParentComponent } from "solid-js";

type Props = {
	centered?: boolean;
	size?: "sm" | "md" | "lg" | "xl" | "full";
	padless?: boolean;
	extraClass?: string;
	extraClassList?: Record<string, boolean>;
};

export const Container: ParentComponent<Props> = (props) => {
	return (
		<div
			class={`w-full ${props.extraClass}`}
			classList={{
				"py-8 px-3 md:px-8 pb-32": !props.padless,
				"max-w-2xl 3xl:max-w-3xl": props.size === "sm",
				"max-w-4xl 3xl:max-w-5xl": props.size === "md",
				"max-w-6xl 3xl:max-w-7xl": !props.size || props.size === "lg",
				"max-w-7xl 3xl:max-w-8xl": props.size === "xl",
				"mx-auto": props.centered,
				...props.extraClassList,
			}}
		>
			{props.children}
		</div>
	);
};
