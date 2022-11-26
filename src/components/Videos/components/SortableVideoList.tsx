import { Icon } from "@components/Icon";
import { Video, VideoListProps } from "@components/Video";
import { createSortable, transformStyle, useDragDropContext } from "@thisbeyond/solid-dnd";
import { useNavigate } from "solid-app-router";
import { Component } from "solid-js";

type Props = {
	initialId: string;
	initialVideoProps: VideoListProps;
};

export const SortableVideoList: Component<Props> = (props) => {
	const navigate = useNavigate();

	const sortable = createSortable(props.initialId);
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const [state] = useDragDropContext()!;

	return (
		<div
			ref={sortable.ref}
			style={transformStyle(sortable.transform)}
			class="flex-row-center"
			classList={{
				"opacity-25": sortable.isActiveDraggable,
				"transition-transform": !!state.active.draggable,
			}}
		>
			<div
				class="pl-0.5 pr-1 py-3 fill-neutral-400 hover:fill-neutral-100 hover:cursor-pointer touch-none"
				{...sortable.dragActivators}
			>
				<Icon name="sixDots" size="md" />
			</div>
			<Video.List
				{...props.initialVideoProps}
				onClick={() => navigate(`/app/video/${props.initialVideoProps.video.id}`)}
			/>
		</div>
	);
};

export const DummySortableVideoList: Component<Omit<Props, "initialId">> = (props) => {
	return (
		<div class="flex-row-center max-w-[calc(100vw-1.5rem)]">
			<div class="pl-0.5 pr-1 py-3 fill-neutral-400 hover:fill-neutral-100 hover:cursor-pointer">
				<Icon name="sixDots" size="md" />
			</div>
			<Video.List {...props.initialVideoProps} />
		</div>
	);
};
