import { Icon } from "@common/components";
import { createSortable, transformStyle, useDragDropContext } from "@thisbeyond/solid-dnd";
import { Video, VideoListProps } from "@youtube/components";
import { Component } from "solid-js";

type Props = {
	initialId: string;
	initialVideoProps: VideoListProps;
};

type DummyProps = Omit<Props, "initialId">;

export const SortableVideoList: Component<Props> = (props) => {
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
			<Video.List
				extraContainerClass="cursor-ns-resize"
				extraImageClass="pointer-events-none"
				extraContextMenuButtonClass="hidden md:block"
				right={() => (
					<div
						{...sortable.dragActivators}
						class="block md:hidden px-1 py-3 fill-neutral-400 hover:fill-neutral-100 touch-none"
						onClick={(e) => e.stopPropagation()}
					>
						<Icon name="sixDots" size="xl" />
					</div>
				)}
				{...props.initialVideoProps}
			/>
		</div>
	);
};

export const DummySortableVideoList: Component<DummyProps> = (props) => {
	return (
		<Video.List
			extraContextMenuButtonClass="hidden md:block"
			right={() => (
				<div
					class="block md:hidden px-1 py-3 fill-neutral-400 hover:fill-neutral-100 touch-none"
					onClick={(e) => e.stopPropagation()}
				>
					<Icon name="sixDots" size="xl" />
				</div>
			)}
			{...props.initialVideoProps}
		/>
	);
};
