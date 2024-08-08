import { Show, type JSX, type ParentComponent } from "solid-js";

type Props = {
	centered?: boolean;
	size?: "sm" | "md" | "lg" | "xl" | "full" | "content";
	fit?: boolean;
	padless?: boolean;
	bottomPadless?: boolean;
	transparent?: boolean;
	extraClass?: string;
	extraClassList?: Record<string, boolean | undefined>;
} & Omit<JSX.HTMLAttributes<HTMLDivElement>, "class" | "classList">;

export const Container: ParentComponent<Props> = (props) => {
	const wrapperClassList = () => {
		return {
			"bg-neutral-950": !props.transparent,
			"bg-transparent": props.transparent,
			"w-full h-full overflow-y-auto md:rounded-lg": true,
		};
	};

	const contentClassList = () => {
		return {
			"py-8 px-3 md:px-8": !props.padless,
			"pb-32": !props.bottomPadless && !props.padless,
			"max-w-2xl 3xl:max-w-3xl": props.size === "sm",
			"max-w-4xl 3xl:max-w-5xl": props.size === "md",
			"max-w-6xl 3xl:max-w-7xl": !props.size || props.size === "lg",
			"max-w-7xl 3xl:max-w-8xl": props.size === "xl",
			"max-w-fit": props.size === "content",
			"mx-auto": props.centered,
			...props.extraClassList,
			[props.extraClass || ""]: !!props.extraClass,
		};
	};

	return (
		<div class="h-full w-full overflow-y-hidden md:rounded-lg">
			<Show
				when={!props.fit}
				fallback={
					<div classList={{ ...wrapperClassList(), ...contentClassList() }} {...props}>
						{props.children}
					</div>
				}
			>
				<div classList={wrapperClassList()}>
					<div classList={contentClassList()} {...props}>
						{props.children}
					</div>
				</div>
			</Show>
		</div>
	);
};
