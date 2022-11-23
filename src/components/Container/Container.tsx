import { ParentComponent } from "solid-js";

type Props = {
	centered?: boolean;
	size?: "sm" | "md" | "lg" | "full";
	extraClass?: string;
	extraClassList?: Record<string, boolean>;
};

export const Container: ParentComponent<Props> = (props) => {
	return (
		<div
			class={`w-full ${props.extraClass}`}
			classList={{
				"max-w-2xl 3xl:max-w-3xl": props.size === "sm",
				"max-w-4xl 3xl:max-w-5xl": props.size === "md",
				"max-w-6xl 3xl:max-w-7xl": !props.size || props.size === "lg",
				"mx-auto": props.centered,
				...props.extraClassList,
			}}
		>
			{props.children}
		</div>
	);
};
