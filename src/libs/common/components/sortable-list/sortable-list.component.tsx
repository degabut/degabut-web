import {
	DragDropProvider,
	DragDropSensors,
	DragOverlay,
	SortableProvider,
	closestCenter,
	type DragEventHandler,
	type createSortable,
} from "@thisbeyond/solid-dnd";
import { For, Show, createEffect, createSignal, type JSX } from "solid-js";
import { List } from "./components";

type SortableData<Data> = {
	id: string;
	data: Data;
};

type SortEvent = {
	from: number;
	to: number;
};

type SortableListProps<Data> = {
	data: Data[];
	id: (data: Data) => string;
	customDragActivator?: boolean;
	overlay: (data: SortableData<Data>) => JSX.Element;
	children: (data: Data, sortable: ReturnType<typeof createSortable>) => JSX.Element;
	onSort?: (event: SortEvent, data: SortableData<Data>) => void;
};

export function SortableList<Data = unknown>(props: SortableListProps<Data>) {
	let currentNode: HTMLElement | null = null;

	const [items, setItems] = createSignal<SortableData<Data>[]>([]);
	const [activeItem, setActiveItem] = createSignal<SortableData<Data> | null>(null);
	const ids = () => items().map((d) => d.id);

	createEffect(() => {
		setItems(props.data.map((data) => ({ id: props.id(data), data })));
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
		<DragDropProvider
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			onDragMove={onDragMove}
			collisionDetector={closestCenter}
		>
			<DragDropSensors />
			<SortableProvider ids={ids()}>
				<For each={items()}>
					{(p) => (
						<List data={p.data} initialId={p.id} customDragActivator={props.customDragActivator}>
							{(data, sortable) => props.children(data, sortable)}
						</List>
					)}
				</For>
			</SortableProvider>

			<DragOverlay class="w-0">
				<Show when={activeItem()} keyed>
					{(i) => props.overlay(i)}
				</Show>
			</DragOverlay>
		</DragDropProvider>
	);
}
