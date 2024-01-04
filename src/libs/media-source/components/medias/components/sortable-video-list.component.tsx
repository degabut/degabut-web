import { Icon } from "@common/components";
import { createSortable, transformStyle, useDragDropContext } from "@thisbeyond/solid-dnd";
import { Component } from "solid-js";
import { MediaSource, MediaSourceListProps } from "../../media";

type Props = {
	initialId: string;
	initialMediaSourceProps: MediaSourceListProps;
};

const mediaListClassProps = {
	extraContainerClass: "cursor-ns-resize",
	extraImageClass: "pointer-events-none",
	extraContextMenuButtonClass: "hidden md:block",
};

export const SortableMediaList: Component<Props> = (props) => {
	const sortable = createSortable(props.initialId);
	const [state] = useDragDropContext()!;

	return (
		<div
			ref={sortable.ref}
			style={transformStyle(sortable.transform)}
			classList={{
				"opacity-25": sortable.isActiveDraggable,
				"transition-transform": !!state.active.draggable,
			}}
		>
			<MediaSource.List
				{...mediaListClassProps}
				right={() => (
					<div
						{...sortable.dragActivators}
						class="px-1 py-3 fill-neutral-400 hover:fill-neutral-100 touch-none"
						onClick={(e) => e.stopPropagation()}
					>
						<Icon name="sixDots" size="xl" />
					</div>
				)}
				{...props.initialMediaSourceProps}
			/>
		</div>
	);
};

export const SortableMediaListMd: Component<Props> = (props) => {
	const sortable = createSortable(props.initialId);
	const [state] = useDragDropContext()!;

	return (
		<div
			use:sortable
			style={transformStyle(sortable.transform)}
			classList={{
				"opacity-25": sortable.isActiveDraggable,
				"transition-transform": !!state.active.draggable,
			}}
		>
			<MediaSource.List {...mediaListClassProps} {...props.initialMediaSourceProps} />
		</div>
	);
};

type DummyProps = Omit<Props, "initialId">;

export const DummySortableMediaList: Component<DummyProps> = (props) => {
	return (
		<MediaSource.List
			extraContextMenuButtonClass="hidden md:block"
			right={() => (
				<div
					class="block md:hidden px-1 py-3 fill-neutral-400 hover:fill-neutral-100 touch-none"
					onClick={(e) => e.stopPropagation()}
				>
					<Icon name="sixDots" size="xl" />
				</div>
			)}
			{...props.initialMediaSourceProps}
		/>
	);
};
