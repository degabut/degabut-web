import { Video, VideoListProps } from "@components/Video";
import { useNavigate } from "@solidjs/router";
import { createSortable, transformStyle, useDragDropContext } from "@thisbeyond/solid-dnd";
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
			{...sortable.dragActivators}
			style={transformStyle(sortable.transform)}
			classList={{
				"opacity-25": sortable.isActiveDraggable,
				"transition-transform": !!state.active.draggable,
			}}
		>
			<Video.List
				extraContainerClass="cursor-ns-resize"
				{...props.initialVideoProps}
				onClick={() => navigate(`/app/video/${props.initialVideoProps.video.id}`)}
			/>
		</div>
	);
};

export const DummySortableVideoList: Component<Omit<Props, "initialId">> = (props) => {
	return <Video.List {...props.initialVideoProps} />;
};
