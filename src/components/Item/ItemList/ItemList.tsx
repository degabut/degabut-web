import type { IThumbnail } from "@api";
import { ContextMenuButton } from "@components/ContextMenu";
import { Text } from "@components/Text";
import { contextMenu } from "@directives/contextMenu";
import { ContextMenuDirectiveParams } from "@providers/ContextMenuProvider";
import { Component, JSX, Show } from "solid-js";
import { ItemListThumbnail, ItemListThumbnailBig } from "./components";

contextMenu;

export type BaseProps = {
	title: string;
	extra?: JSX.Element;
	thumbnails: IThumbnail[];
	contextMenu?: ContextMenuDirectiveParams;
	disableContextMenu?: boolean;
	hideContextMenuButton?: boolean;
	extraContainerClass?: string;
	extraContainerClassList?: Record<string, boolean>;
	hideThumbnail?: boolean;
	extraThumbnailClass?: string;
	extraTitleClass?: string;
	onClick?: () => void;
};

export type ItemListProps = BaseProps & {
	left?: JSX.Element;
	right?: JSX.Element;
};

export const ItemList: Component<ItemListProps> = (props) => {
	return (
		<div
			class="flex-row-center items-stretch w-full p-1.5 hover:bg-white/5 rounded"
			classList={{
				"cursor-pointer": !!props.onClick,
				...props.extraContainerClassList,
				[props.extraContainerClass || ""]: !!props.extraContainerClass,
			}}
			use:contextMenu={props.disableContextMenu ? undefined : props.contextMenu}
			onClick={() => props.onClick?.()}
		>
			{props.left}

			<Show when={!props.hideThumbnail}>
				<ItemListThumbnail
					thumbnails={props.thumbnails}
					title={props.title}
					extraClass={`shrink-0 ${props.extraThumbnailClass}`}
				/>
			</Show>

			<div class="flex flex-col grow space-y-0.5 truncate" classList={{ "ml-3": !props.hideThumbnail }}>
				<Text.Body1
					truncate
					class="font-normal"
					classList={{ [props.extraTitleClass || ""]: !!props.extraTitleClass }}
					title={props.title}
				>
					{props.title}
				</Text.Body1>

				<Show when={props.extra}>
					<div class="flex-row-center text-sm align-bottom">{props.extra}</div>
				</Show>
			</div>

			{props.right}

			<Show when={!props.disableContextMenu && !props.hideContextMenuButton}>
				<ContextMenuButton contextMenu={props.contextMenu} />
			</Show>
		</div>
	);
};

export type ItemListBigProps = BaseProps & {
	thumbnailOverlay?: JSX.Element;
	thumbnailBigOverlay?: JSX.Element;
};

export const ItemListBig: Component<ItemListBigProps> = (props) => {
	return (
		<div
			class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 md:space-y-0 hover:bg-white/5 rounded"
			classList={{
				"cursor-pointer": !!props.onClick,
				...props.extraContainerClassList,
				[props.extraContainerClass || ""]: !!props.extraContainerClass,
			}}
			use:contextMenu={props.disableContextMenu ? undefined : props.contextMenu}
			onClick={() => props.onClick?.()}
		>
			<Show when={!props.hideThumbnail}>
				<ItemListThumbnailBig
					title={props.title}
					overlay={props.thumbnailOverlay}
					bigOverlay={props.thumbnailBigOverlay}
					thumbnails={props.thumbnails}
					extraClass={props.extraThumbnailClass}
				/>
			</Show>

			<div class="flex flex-col sm:space-y-2 w-full truncate px-2 pb-2 sm:pt-1">
				<div class="flex-row-center truncate">
					<Text.H4
						truncate
						class="grow"
						classList={{ [props.extraTitleClass || ""]: !!props.extraTitleClass }}
						title={props.title}
					>
						{props.title}
					</Text.H4>

					<Show when={!props.disableContextMenu && !props.hideContextMenuButton}>
						<ContextMenuButton contextMenu={props.contextMenu} />
					</Show>
				</div>

				<Show when={props.extra}>
					<div class="space-y-1">{props.extra}</div>
				</Show>
			</div>
		</div>
	);
};

export const ItemListResponsive: Component<ItemListProps & { big?: boolean }> = (props) => {
	return (
		<Show when={props.big} fallback={<ItemList {...props} />}>
			<ItemListBig {...props} />
		</Show>
	);
};
