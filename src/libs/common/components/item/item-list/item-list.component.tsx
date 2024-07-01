import { Show, type Accessor, type Component, type JSX } from "solid-js";
import { ContextMenuButton, Text } from "../../";
import { contextMenu, type ContextMenuDirectiveParams } from "../../../directives";
import { ItemListImage } from "./item-list-image.component";

contextMenu;

export type ItemListSize = "sm" | "md" | "lg";

export type ItemListProps = {
	title: string | Accessor<JSX.Element>;
	extra?: Accessor<JSX.Element>;
	imageUrl?: string | string[];
	imageHoverElement?: Accessor<JSX.Element>;
	extraImageClass?: string;
	contextMenu?: ContextMenuDirectiveParams;
	hideContextMenuButton?: boolean;
	extraContainerClass?: string;
	extraContainerClassList?: Record<string, boolean | undefined>;
	extraTitleClassList?: Record<string, boolean | undefined>;
	extraContextMenuButtonClass?: string;
	onClick?: () => void;
	left?: Accessor<JSX.Element>;
	size?: ItemListSize;
	imageHoverOnParent?: boolean;
	right?: Accessor<JSX.Element>;
};

export const ItemList: Component<ItemListProps> = (props) => {
	return (
		<div
			class="group/item-list flex-row-center items-stretch w-full p-1.5 active:bg-white/5 rounded"
			classList={{
				"cursor-pointer hover:bg-white/5": !!props.onClick || props.contextMenu?.openWithClick,
				...props.extraContainerClassList,
				[props.extraContainerClass || ""]: !!props.extraContainerClass,
			}}
			use:contextMenu={props.contextMenu}
			onClick={() => props.onClick?.()}
			onKeyPress={(e) => e.key === "Enter" && props.onClick?.()}
			tabIndex={props.onClick || props.contextMenu?.openWithClick ? 0 : undefined}
		>
			{props.left?.()}

			<Show when={props.size !== "sm"}>
				<Show when={props.imageUrl} keyed>
					{(imageUrl) => (
						<ItemListImage
							imageUrl={imageUrl}
							hoverElement={props.imageHoverElement}
							size={props.size}
							imageHoverOnParent={props.imageHoverOnParent}
							title={typeof props.title === "string" ? props.title : undefined}
							extraClass={`shrink-0 ${props.extraImageClass}`}
						/>
					)}
				</Show>
			</Show>

			<div
				class="flex flex-col grow truncate"
				classList={{
					"space-y-0.5": !props.size || props.size === "md",
					"space-y-1.5": props.size === "lg",
					"ml-3": (!!props.imageUrl || !!props.left) && props.size !== "sm",
					"mr-1.5 md:mr-3": !!props.right || (props.contextMenu && !props.hideContextMenuButton),
				}}
			>
				{typeof props.title !== "string" ? (
					props.title()
				) : (
					<Text.Body1
						truncate
						class="font-normal"
						classList={{
							...props.extraTitleClassList,
							"text-sm": props.size === "sm",
						}}
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
				{(e) => <div class="invisible group-hover/item-list:visible">{e()}</div>}
			</Show>

			<Show when={props.contextMenu && !props.hideContextMenuButton}>
				<div
					class="invisible group-hover/item-list:visible"
					classList={{ [props.extraContextMenuButtonClass || ""]: !!props.extraContextMenuButtonClass }}
				>
					<ContextMenuButton contextMenu={props.contextMenu} />
				</div>
			</Show>
		</div>
	);
};
