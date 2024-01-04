import { Item } from "@common/components";
import { useScreen } from "@common/hooks";
import {
	DragDropProvider,
	DragDropSensors,
	DragEventHandler,
	DragOverlay,
	SortableProvider,
	closestCenter,
} from "@thisbeyond/solid-dnd";
import { For, Show, createEffect, createMemo, createSignal } from "solid-js";
import { MediaSourceListProps } from "../media";
import { DummySortableMediaList, SortableMediaList, SortableMediaListMd } from "./components";

type SortableData = {
	id: string;
	mediaSourceProps: MediaSourceListProps;
};

type FullSortableData<Data> = SortableData & {
	data: Data;
};

type SortEvent = {
	from: number;
	to: number;
};

type SortableMediaSourcesListProps<Data> = {
	data: Data[];
	dense?: boolean;
	isLoading?: boolean;
	showWhenLoading?: boolean;
	sortableProps?: (data: Data) => SortableData;
	onSort?: (event: SortEvent, data: FullSortableData<Data>) => void;
};

export function SortableMediaSourcesList<Data = unknown>(props: SortableMediaSourcesListProps<Data>) {
	const screen = useScreen();
	let currentNode: HTMLElement | null = null;

	const sortableProps = createMemo<FullSortableData<Data>[]>(() => {
		const processor = props.sortableProps;
		if (!processor) return [];
		const data = props.data.map((data) => {
			const { id, mediaSourceProps } = processor(data);
			return { id, mediaSourceProps, data };
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
		<div
			class="h-full overflow-y-auto"
			classList={{
				"space-y-2": !props.dense,
				"space-y-0.5": props.dense,
			}}
		>
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
							{(p) => (
								<Show
									when={screen.gte.md}
									fallback={
										<SortableMediaList
											initialId={p.id}
											initialMediaSourceProps={p.mediaSourceProps}
										/>
									}
								>
									<SortableMediaListMd
										initialId={p.id}
										initialMediaSourceProps={p.mediaSourceProps}
									/>
								</Show>
							)}
						</For>
					</SortableProvider>

					<DragOverlay class="w-0">
						<Show when={activeItem()} keyed>
							{(i) => <DummySortableMediaList initialMediaSourceProps={i.mediaSourceProps} />}
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
