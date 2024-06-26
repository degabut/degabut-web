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
			class="relative shrink-0"
			classList={{
				"item-image": !props.size || props.size === "md",
				"item-image-lg": props.size === "lg",
				[props.extraContainerClass || ""]: !!props.extraContainerClass,
			}}
		>
			<Show when={props.hoverElement} keyed>
				{(e) => (
					<div
						class="absolute w-full h-full"
						classList={{
							"child-visible": props.imageHoverOnParent,
							"opacity-0 hover:opacity-100": !props.imageHoverOnParent,
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
				class="object-cover rounded"
				classList={{
					"item-image": !props.size || props.size === "md",
					"item-image-lg": props.size === "lg",
					[props.extraClass || ""]: !!props.extraClass,
				}}
			/>
		</div>
	);
};
