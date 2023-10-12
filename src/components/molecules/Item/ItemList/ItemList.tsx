import { Text } from "@components/atoms";
import { ContextMenuButton } from "@components/molecules";
import { contextMenu } from "@directives/contextMenu";
import { ContextMenuDirectiveParams } from "@providers/ContextMenuProvider";
import { Component, JSX, Show } from "solid-js";
import "./ItemList.css";
import { ItemListIcon, ItemListIconBig } from "./components";

contextMenu;

type BaseProps = {
	title: JSX.Element;
	extra?: JSX.Element;
	icon?: string | string[];
	contextMenu?: ContextMenuDirectiveParams;
	hideContextMenuButton?: boolean;
	extraContainerClass?: string;
	extraContainerClassList?: Record<string, boolean>;
	extraThumbnailClass?: string;
	extraTitleClass?: string;
	extraContextMenuButtonClass?: string;
	onClick?: () => void;
};

export type ItemListProps = BaseProps & {
	left?: JSX.Element;
	right?: JSX.Element;
	rightVisible?: boolean;
};

export const ItemList: Component<ItemListProps> = (props) => {
	return (
		<div
			class="item-list flex-row-center items-stretch w-full p-1.5 hover:bg-white/5 rounded"
			classList={{
				"cursor-pointer": !!props.onClick,
				...props.extraContainerClassList,
				[props.extraContainerClass || ""]: !!props.extraContainerClass,
			}}
			use:contextMenu={props.contextMenu}
			onClick={() => props.onClick?.()}
		>
			{props.left}

			<Show when={props.icon} keyed>
				{(icon) => (
					<ItemListIcon
						icon={icon}
						title={typeof props.title === "string" ? props.title : undefined}
						extraClass={`shrink-0 ${props.extraThumbnailClass}`}
					/>
				)}
			</Show>

			<div class="flex flex-col grow space-y-0.5 truncate" classList={{ "ml-3": !!props.icon || !!props.left }}>
				<Show when={typeof props.title === "string"} fallback={props.title}>
					<Text.Body1
						truncate
						class="font-normal"
						classList={{ [props.extraTitleClass || ""]: !!props.extraTitleClass }}
						title={props.title as string}
					>
						{props.title}
					</Text.Body1>
				</Show>

				<Show when={props.extra}>
					<div class="flex-row-center text-sm align-bottom">{props.extra}</div>
				</Show>
			</div>

			<Show when={props.right}>
				<div classList={{ right: !props.rightVisible }}>{props.right}</div>
			</Show>

			<Show when={props.contextMenu && !props.hideContextMenuButton}>
				<div
					class="right"
					classList={{ [props.extraContextMenuButtonClass || ""]: !!props.extraContextMenuButtonClass }}
				>
					<ContextMenuButton contextMenu={props.contextMenu} />
				</div>
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
			use:contextMenu={props.contextMenu}
			onClick={() => props.onClick?.()}
		>
			<Show when={props.icon} keyed>
				{(icon) => (
					<ItemListIconBig
						title={typeof props.title === "string" ? props.title : undefined}
						overlay={props.thumbnailOverlay}
						bigOverlay={props.thumbnailBigOverlay}
						icon={icon}
						extraClass={props.extraThumbnailClass}
					/>
				)}
			</Show>

			<div class="flex flex-col sm:space-y-2 w-full truncate px-2 pb-2 sm:pt-1">
				<div class="flex-row-center truncate">
					<Show when={typeof props.title === "string"} fallback={props.title}>
						<Text.H4
							truncate
							class="grow"
							classList={{ [props.extraTitleClass || ""]: !!props.extraTitleClass }}
							title={typeof props.title === "string" ? props.title : undefined}
						>
							{props.title}
						</Text.H4>
					</Show>

					<Show when={props.contextMenu && !props.hideContextMenuButton}>
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
