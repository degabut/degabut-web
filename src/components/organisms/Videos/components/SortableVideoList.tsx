import { Icon } from "@components/atoms";
import { Video, VideoListProps } from "@components/molecules";
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
				extraIconClass="pointer-events-none"
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
				extraContextMenuButtonClass="hidden md:block"
				right={
					<div
						{...sortable.dragActivators}
						class="px-1 py-3 fill-neutral-400 hover:fill-neutral-100 touch-none"
						onClick={(e) => e.stopPropagation()}
					>
						<Icon name="sixDots" size="xl" />
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
			extraContextMenuButtonClass="hidden md:block"
			right={
				<div
					class="px-1 py-3 fill-neutral-400 hover:fill-neutral-100 touch-none"
					onClick={(e) => e.stopPropagation()}
				>
					<Icon name="sixDots" size="xl" />
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
