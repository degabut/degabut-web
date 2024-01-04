import { ContextMenuButton, Text } from "@common/components";
import { ContextMenuDirectiveParams, contextMenu } from "@common/directives";
import { Accessor, Component, JSX, Show } from "solid-js";
import { ItemListImage, ItemListImageBig } from "./item-list-image.component";
import "./item-list.style.css";

contextMenu;

type BaseProps = {
	title: string | Accessor<JSX.Element>;
	extra?: Accessor<JSX.Element>;
	imageUrl?: string | string[];
	imageHoverElement?: Accessor<JSX.Element>;
	extraImageClass?: string;
	contextMenu?: ContextMenuDirectiveParams;
	hideContextMenuButton?: boolean;
	extraContainerClass?: string;
	extraContainerClassList?: Record<string, boolean>;
	extraTitleClass?: string;
	extraContextMenuButtonClass?: string;
	onClick?: () => void;
};

export type ItemListProps = BaseProps & {
	left?: Accessor<JSX.Element>;
	right?: Accessor<JSX.Element>;
	rightVisible?: boolean;
};

export const ItemList: Component<ItemListProps> = (props) => {
	return (
		<div
			class="item-list flex-row-center items-stretch w-full p-1.5 active:bg-white/5 rounded"
			classList={{
				"cursor-pointer hover:bg-white/5": !!props.onClick || props.contextMenu?.openWithClick,
				...props.extraContainerClassList,
				[props.extraContainerClass || ""]: !!props.extraContainerClass,
			}}
			use:contextMenu={props.contextMenu}
			onClick={() => props.onClick?.()}
		>
			{props.left?.()}

			<Show when={props.imageUrl} keyed>
				{(imageUrl) => (
					<ItemListImage
						imageUrl={imageUrl}
						hoverElement={props.imageHoverElement}
						title={typeof props.title === "string" ? props.title : undefined}
						extraClass={`shrink-0 ${props.extraImageClass}`}
					/>
				)}
			</Show>

			<div
				class="flex flex-col grow space-y-0.5 truncate"
				classList={{ "ml-3": !!props.imageUrl || !!props.left }}
			>
				{typeof props.title !== "string" ? (
					props.title()
				) : (
					<Text.Body1
						truncate
						class="font-normal"
						classList={{ [props.extraTitleClass || ""]: !!props.extraTitleClass }}
						title={props.title as string}
					>
						{props.title}
					</Text.Body1>
				)}

				<Show when={props.extra} keyed>
					{(e) => <div class="flex-row-center text-sm align-bottom">{e()}</div>}
				</Show>
			</div>

			<Show when={props.right} keyed>
				{(e) => <div classList={{ right: !props.rightVisible }}>{e()}</div>}
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

export const ItemListBig: Component<BaseProps> = (props) => {
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
			<Show when={props.imageUrl} keyed>
				{(imageUrl) => (
					<ItemListImageBig
						title={typeof props.title === "string" ? props.title : undefined}
						hoverElement={props.imageHoverElement}
						imageUrl={imageUrl}
						extraClass={props.extraImageClass}
					/>
				)}
			</Show>

			<div class="flex flex-col w-full truncate px-2 pb-2 sm:pt-1">
				<div class="flex-row-center truncate">
					{typeof props.title !== "string" ? (
						props.title()
					) : (
						<Text.H4
							truncate
							class="grow"
							classList={{ [props.extraTitleClass || ""]: !!props.extraTitleClass }}
							title={typeof props.title === "string" ? props.title : undefined}
						>
							{props.title}
						</Text.H4>
					)}

					<Show when={props.contextMenu && !props.hideContextMenuButton}>
						<ContextMenuButton contextMenu={props.contextMenu} />
					</Show>
				</div>

				<Show when={props.extra} keyed>
					{(e) => <div class="space-y-1">{e()}</div>}
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
