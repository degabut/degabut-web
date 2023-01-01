import { Icon } from "@components/Icon";
import { Video, VideoListProps } from "@components/Video";
import { useScreen } from "@hooks/useScreen";
import { useNavigate } from "@solidjs/router";
import { createSortable, transformStyle, useDragDropContext } from "@thisbeyond/solid-dnd";
import { Component, Show } from "solid-js";

type Props = {
	initialId: string;
	initialVideoProps: VideoListProps;
};

type DummyProps = Omit<Props, "initialId">;

const MdSortableVideoList: Component<Props> = (props) => {
	const navigate = useNavigate();

	const sortable = createSortable(props.initialId);
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
			<Video.List
				extraContainerClass="cursor-ns-resize"
				extraThumbnailClass="pointer-events-none"
				{...props.initialVideoProps}
				onClick={() => navigate(`/app/video/${props.initialVideoProps.video.id}`)}
			/>
		</div>
	);
};

const MdDummySortableVideoList: Component<DummyProps> = (props) => {
	return <Video.List {...props.initialVideoProps} />;
};

const LteSmSortableVideoList: Component<Props> = (props) => {
	const navigate = useNavigate();

	const sortable = createSortable(props.initialId);
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
				extraContainerClass="!pl-0"
				left={
					<div
						class="px-0.5 py-4 fill-neutral-400 hover:fill-neutral-100 touch-none"
						onClick={(e) => e.stopPropagation()}
					>
						<Icon {...sortable.dragActivators} name="sixDots" size="md" />
					</div>
				}
				{...props.initialVideoProps}
				onClick={() => navigate(`/app/video/${props.initialVideoProps.video.id}`)}
			/>
		</div>
	);
};

const LteSmDummySortableVideoList: Component<DummyProps> = (props) => {
	return (
		<Video.List
			extraContainerClass="!pl-0"
			left={
				<div class="px-0.5 fill-neutral-400 hover:fill-neutral-100 hover:cursor-pointer touch-none">
					<Icon name="sixDots" size="md" />
				</div>
			}
			{...props.initialVideoProps}
		/>
	);
};

export const SortableVideoList: Component<Props> = (props) => {
	const screen = useScreen();
	return (
		<Show when={screen.lte.sm} fallback={<MdSortableVideoList {...props} />}>
			<LteSmSortableVideoList {...props} />
		</Show>
	);
};

export const DummySortableVideoList: Component<DummyProps> = (props) => {
	const screen = useScreen();
	return (
		<Show when={screen.lte.sm} fallback={<MdDummySortableVideoList {...props} />}>
			<LteSmDummySortableVideoList {...props} />
		</Show>
	);
};
