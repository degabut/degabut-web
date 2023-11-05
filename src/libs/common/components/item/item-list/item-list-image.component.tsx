import { Accessor, Component, JSX, Show } from "solid-js";

type Props = {
	imageUrl: string | string[];
	title?: string;
	extraClass?: string;
	extraContainerClass?: string;
	hoverElement?: Accessor<JSX.Element>;
};

export const ItemListImage: Component<Props> = (props) => {
	const src = () => (typeof props.imageUrl === "string" ? props.imageUrl : props.imageUrl.at(0));

	return (
		<div
			class="w-12 h-12 relative shrink-0"
			classList={{ [props.extraContainerClass || ""]: !!props.extraContainerClass }}
		>
			<Show when={props.hoverElement} keyed>
				{(e) => (
					<div class="hidden md:block opacity-0 hover:opacity-100 transition absolute w-full h-full">
						{e()}
					</div>
				)}
			</Show>

			<img
				loading="lazy"
				referrerpolicy="no-referrer"
				src={src()}
				alt={props.title}
				class="h-12 w-12 object-cover rounded"
				classList={{ [props.extraClass || ""]: !!props.extraClass }}
			/>
		</div>
	);
};

export const ItemListImageBig: Component<Props> = (props) => {
	const src = () => (typeof props.imageUrl === "string" ? props.imageUrl : props.imageUrl.at(0));

	return (
		<div class="relative flex" classList={{ [props.extraContainerClass || ""]: !!props.extraContainerClass }}>
			<div class="sm:w-[16rem] sm:h-[9rem] mx-auto">
				<img
					loading="lazy"
					referrerpolicy="no-referrer"
					src={src()}
					alt={props.title}
					class="h-full w-full relative object-cover rounded-md"
					classList={{ [props.extraClass || ""]: !!props.extraClass }}
				/>
			</div>

			<Show when={props.hoverElement} keyed>
				{(e) => (
					<div class="hidden md:block opacity-0 hover:opacity-100 transition absolute w-full h-full">
						{e()}
					</div>
				)}
			</Show>
		</div>
	);
};
