import { Text } from "@common/components";
import { ContextMenuDirectiveParams, contextMenu } from "@common/directives";
import { Accessor, Component, JSX, Show } from "solid-js";
import { ItemCardImage } from "./item-card-image.component";

contextMenu;

export type ItemCardProps = {
	title: string;
	imageUrl: string | string[];
	imageHoverElement?: Accessor<JSX.Element>;
	description?: string;
	extra?: Accessor<JSX.Element>;
	contextMenu?: ContextMenuDirectiveParams;
	extraContainerClass?: string;
	extraContainerClassList?: Record<string, boolean>;
	extraImageClass?: string;
	inQueue?: boolean;
	onClick?: () => void;
};

export const ItemCard: Component<ItemCardProps> = (props) => {
	return (
		<div
			class="flex flex-col space-y-2"
			classList={{
				"cursor-pointer ": !!props.onClick || props.contextMenu?.openWithClick,
				...props.extraContainerClassList,
				[props.extraContainerClass || ""]: !!props.extraContainerClass,
			}}
			use:contextMenu={props.contextMenu}
			onClick={() => props.onClick?.()}
		>
			<ItemCardImage
				title={props.title}
				imageUrl={props.imageUrl}
				hoverElement={props.imageHoverElement}
				extraClass={props.extraImageClass}
			/>

			<div class="flex flex-col space-y-0.5">
				<Text.Body1 class="w-full truncate font-normal hover:underline underline-offset-2">
					{props.title}
				</Text.Body1>
				<Show when={props.description} keyed>
					{(d) => <Text.Caption2 class="w-full truncate">{d}</Text.Caption2>}
				</Show>
			</div>

			<Show when={props.extra} keyed>
				{(e) => <div class="truncate">{e()}</div>}
			</Show>
		</div>
	);
};
