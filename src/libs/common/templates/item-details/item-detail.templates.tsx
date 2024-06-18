import { Divider, useInfiniteScrolling, type ContextMenuDirectiveParams } from "@common";
import { Show, type JSX, type ParentComponent } from "solid-js";
import { MainItem, MainItemSkeleton } from "./components";

type ItemDetailsProps = {
	title: string;
	description?: () => JSX.Element;
	image?: string | (() => JSX.Element);
	actions?: () => JSX.Element;
	isLoading?: boolean;
	contextMenu?: ContextMenuDirectiveParams;
	infiniteCallback?: () => void;
	isInfiniteDisabled?: boolean;
};

export const ItemDetails: ParentComponent<ItemDetailsProps> = (props) => {
	let containerElement!: HTMLDivElement;

	useInfiniteScrolling({
		callback: () => props.infiniteCallback?.(),
		container: () => containerElement,
		disabled: () => !!props.isInfiniteDisabled,
	});

	return (
		<div ref={containerElement} class="space-y-6">
			<Show when={!props.isLoading} fallback={<MainItemSkeleton />}>
				<MainItem {...props} />
			</Show>

			{props.actions?.()}

			<Divider />

			{props.children}
		</div>
	);
};
