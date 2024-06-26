import { Show, type Accessor, type Component, type JSX } from "solid-js";

type Props = {
	imageUrl: string | string[];
	hoverElement?: Accessor<JSX.Element>;
	title?: string;
	extraClass?: string;
};

export const ItemCardImage: Component<Props> = (props) => {
	const src = () => (typeof props.imageUrl === "string" ? props.imageUrl : props.imageUrl.at(-1));

	return (
		<div class="group/item-card-image relative">
			<Show when={props.hoverElement} keyed>
				{(e) => <div class="absolute w-full h-full invisible group-hover/item-card-image:visible">{e()}</div>}
			</Show>

			<img
				loading="lazy"
				referrerpolicy="no-referrer"
				src={src()}
				alt={props.title}
				class="w-full rounded aspect-square object-cover"
				classList={{ [props.extraClass || ""]: !!props.extraClass }}
			/>
		</div>
	);
};
