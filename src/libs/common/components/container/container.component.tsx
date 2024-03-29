import { JSX, ParentComponent } from "solid-js";

type Props = {
	centered?: boolean;
	size?: "sm" | "md" | "lg" | "xl" | "full" | "shrink";
	padless?: boolean;
	bottomPadless?: boolean;
	transparent?: boolean;
	extraClass?: string;
	extraClassList?: Record<string, boolean>;
} & JSX.HTMLAttributes<HTMLDivElement>;

export const Container: ParentComponent<Props> = (props) => {
	return (
		<div
			class="w-full h-full overflow-y-auto md:rounded-lg"
			classList={{
				"bg-neutral-950": !props.transparent,
				"bg-transparent": props.transparent,
			}}
		>
			<div
				classList={{
					"py-8 px-3 md:px-8": !props.padless,
					"pb-32": !props.bottomPadless && !props.padless,
					"max-w-2xl 3xl:max-w-3xl": props.size === "sm",
					"max-w-4xl 3xl:max-w-5xl": props.size === "md",
					"max-w-6xl 3xl:max-w-7xl": !props.size || props.size === "lg",
					"max-w-7xl 3xl:max-w-8xl": props.size === "xl",
					"mx-auto": props.centered,
					...props.extraClassList,
					[props.extraClass || ""]: !!props.extraClass,
				}}
				{...props}
			>
				{props.children}
			</div>
		</div>
	);
};
