import { IThumbnail } from "@api";
import { Component, JSX, Show } from "solid-js";

type Props = {
	thumbnails: IThumbnail[];
	title: string;
	extraClass?: string;
	extraContainerClass?: string;
};

export const ItemListThumbnail: Component<Props> = (props) => {
	return (
		<img
			loading="lazy"
			referrerpolicy="no-referrer"
			src={props.thumbnails.at(0)?.url}
			alt={props.title}
			class="h-12 w-12 object-cover rounded"
			classList={{ [props.extraClass || ""]: !!props.extraClass }}
		/>
	);
};

type BigProps = Props & {
	overlay?: JSX.Element;
	bigOverlay?: JSX.Element;
};

export const ItemListThumbnailBig: Component<BigProps> = (props) => {
	return (
		<div class="relative flex" classList={{ [props.extraContainerClass || ""]: !!props.extraContainerClass }}>
			<div class="sm:w-[16rem] sm:h-[9rem] mx-auto">
				<img
					loading="lazy"
					referrerpolicy="no-referrer"
					src={props.thumbnails.at(-1)?.url}
					alt={props.title}
					class="h-full w-full relative object-cover rounded-md"
					classList={{ [props.extraClass || ""]: !!props.extraClass }}
				/>
			</div>

			<Show when={props.overlay}>
				<div class="absolute bottom-0 right-0 flex-row-center space-x-1.5 text-sm bg-black/90 py-1 px-2 rounded-br">
					{props.overlay}
				</div>
			</Show>

			<Show when={props.bigOverlay}>
				<div class="absolute flex-col-center justify-center space-y-1.5 bottom-0 right-0 rounded-r-md bg-black/90 h-full w-[35%]">
					{props.bigOverlay}
				</div>
			</Show>
		</div>
	);
};
