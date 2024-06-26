import { Show, type Accessor, type Component, type JSX } from "solid-js";
import "../item.css";
import { type ItemListSize } from "./item-list.component";

type Props = {
	imageUrl: string | string[];
	title?: string;
	size?: ItemListSize;
	extraClass?: string;
	extraContainerClass?: string;
	hoverElement?: Accessor<JSX.Element>;
	imageHoverOnParent?: boolean;
};

export const ItemListImage: Component<Props> = (props) => {
	const src = () => (typeof props.imageUrl === "string" ? props.imageUrl : props.imageUrl.at(0));

	return (
		<div
			class="group/item-list-image relative shrink-0"
			classList={{
				"item-image": !props.size || props.size === "md",
				"item-image-lg": props.size === "lg",
				[props.extraContainerClass || ""]: !!props.extraContainerClass,
			}}
		>
			<Show when={props.hoverElement} keyed>
				{(e) => (
					<div
						class="absolute w-full h-full invisible"
						classList={{
							"group-hover/item-list:visible": props.imageHoverOnParent,
							"group-hover/item-list-image:visible": !props.imageHoverOnParent,
						}}
					>
						{e()}
					</div>
				)}
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
