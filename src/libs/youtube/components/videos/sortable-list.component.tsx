import { Item } from "@common/components";
import {
	DragDropProvider,
	DragDropSensors,
	DragEventHandler,
	DragOverlay,
	SortableProvider,
	closestCenter,
} from "@thisbeyond/solid-dnd";
import { For, Show, createEffect, createMemo, createSignal } from "solid-js";
import { VideoListProps } from "../video";
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

type SortableVideosListProps<Data> = {
	data: Data[];
	isLoading?: boolean;
	showWhenLoading?: boolean;
	sortableProps?: (data: Data) => SortableData;
	onSort?: (event: SortEvent, data: FullSortableData<Data>) => void;
};

export function SortableVideosList<Data = unknown>(props: SortableVideosListProps<Data>) {
	let currentNode: HTMLElement | null = null;

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
		setItems(sortableProps());
	});

	const onDragStart: DragEventHandler = ({ draggable }) => {
		const active = items().find((t) => t.id === draggable.id) || null;
		setActiveItem(active);
		currentNode = draggable.node;
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

	const onDragMove = () => {
		currentNode?.scrollIntoView({ block: "nearest", inline: "nearest" });
	};

	return (
		<div class="space-y-2 h-full overflow-y-auto">
			<Show when={props.showWhenLoading || !props.isLoading}>
				<DragDropProvider
					onDragStart={onDragStart}
					onDragEnd={onDragEnd}
					onDragMove={onDragMove}
					collisionDetector={closestCenter}
				>
					<DragDropSensors />
					<SortableProvider ids={ids()}>
						<For each={items()}>
							{(p) => <SortableVideoList initialId={p.id} initialVideoProps={p.videoProps} />}
						</For>
					</SortableProvider>

					<DragOverlay class="w-0">
						<Show when={activeItem()} keyed>
							{(i) => <DummySortableVideoList initialVideoProps={i.videoProps} />}
						</Show>
					</DragOverlay>
				</DragDropProvider>
			</Show>
			<Show when={props.isLoading}>
				<For each={Array(5)}>{() => <Item.ListSkeleton />}</For>
			</Show>
		</div>
	);
}
