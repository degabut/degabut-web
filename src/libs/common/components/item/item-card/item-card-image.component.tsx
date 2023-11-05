import { Accessor, Component, JSX, Show } from "solid-js";

type Props = {
	imageUrl: string | string[];
	hoverElement?: Accessor<JSX.Element>;
	title?: string;
	extraClass?: string;
};

export const ItemCardImage: Component<Props> = (props) => {
	const src = () => (typeof props.imageUrl === "string" ? props.imageUrl : props.imageUrl.at(-1));

	return (
		<div class="relative">
			<Show when={props.hoverElement} keyed>
				{(e) => (
					<div class="hidden md:block opacity-0 hover:opacity-100 transition absolute w-full h-full">
						{e()}
					</div>
				)}
			</Show>
			<img
				src={src()}
				class="w-full rounded-md aspect-square object-cover"
				classList={{ [props.extraClass || ""]: !!props.extraClass }}
			/>
		</div>
	);
};
