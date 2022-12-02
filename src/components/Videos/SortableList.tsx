import { Video, VideoListProps } from "@components/Video";
import {
	closestCenter,
	DragDropProvider,
	DragDropSensors,
	DragEventHandler,
	DragOverlay,
	SortableProvider,
} from "@thisbeyond/solid-dnd";
import { createEffect, createMemo, createSignal, For, JSX, Show } from "solid-js";
import { DummySortableVideoList, SortableVideoList } from "./components";

type SortableData = {
	id: string;
	videoProps: VideoListProps;
};

type FullSortableData<Data> = SortableData & {
	data: Data;
};

type SortEvent = {
	from: number;
	to: number;
};

type VideosListProps<Data> = {
	data: Data[];
	label?: JSX.Element;
	isLoading?: boolean;
	showWhenLoading?: boolean;
	sortableProps?: (data: Data) => SortableData;
	onSort?: (event: SortEvent, data: FullSortableData<Data>) => void;
};

export function SortableVideosList<Data = unknown>(props: VideosListProps<Data>) {
	const sortableProps = createMemo<FullSortableData<Data>[]>(() => {
		const processor = props.sortableProps;
		if (!processor) return [];
		const data = props.data.map((data) => {
			const { id, videoProps } = processor(data);
			return { id, videoProps, data };
		});
		return data;
	});

	const [items, setItems] = createSignal<FullSortableData<Data>[]>([]);
	const [activeItem, setActiveItem] = createSignal<FullSortableData<Data> | null>(null);
	const ids = () => items().map((d) => d.id);

	createEffect(() => {
		// TODO remove this once queue changed to store
		if (
			sortableProps()
				.map((d) => d.id)
				.join() !== ids().join()
		) {
			setItems(sortableProps());
		}
	});

	const onDragStart: DragEventHandler = ({ draggable }) => {
		const active = items().find((t) => t.id === draggable.id) || null;
		setActiveItem(active);
	};

	const onDragEnd: DragEventHandler = ({ draggable, droppable }) => {
		const item = activeItem();
		if (draggable && droppable && item) {
			const currentItems = items();
			const from = currentItems.findIndex((i) => i.id === draggable.id);
			const to = currentItems.findIndex((i) => i.id === droppable.id);
			if (from !== to) {
				const updatedItems = currentItems.slice();
				updatedItems.splice(to, 0, ...updatedItems.splice(from, 1));
				setItems(updatedItems);
				props.onSort?.({ from, to }, item);
			}
		}
	};

	return (
		<div class="space-y-6 md:space-y-4">
			{props.label}

			<div class="space-y-1.5">
				<Show when={props.showWhenLoading || !props.isLoading}>
					<DragDropProvider onDragStart={onDragStart} onDragEnd={onDragEnd} collisionDetector={closestCenter}>
						<DragDropSensors />
						<SortableProvider ids={ids()}>
							<For each={items()}>
								{(p) => <SortableVideoList initialId={p.id} initialVideoProps={p.videoProps} />}
							</For>
						</SortableProvider>

						<DragOverlay>
							<Show when={activeItem()} keyed>
								{(i) => <DummySortableVideoList initialVideoProps={i.videoProps} />}
							</Show>
						</DragOverlay>
					</DragDropProvider>
				</Show>
				<Show when={props.isLoading}>
					<For each={Array(5)}>{() => <Video.ListSkeleton />}</For>
				</Show>
			</div>
		</div>
	);
}
