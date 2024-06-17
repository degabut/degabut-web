import { createSortable, transformStyle, useDragDropContext } from "@thisbeyond/solid-dnd";
import { Show, type JSX } from "solid-js";

type Props<Data> = {
	initialId: string;
	data: Data;
	children: (data: Data, sortable: ReturnType<typeof createSortable>) => JSX.Element;
	customDragActivator?: boolean;
};

export function List<Data>(props: Props<Data>) {
	const sortable = createSortable(props.initialId);
	const [state] = useDragDropContext()!;

	const classList = () => ({
		"focus-within:opacity-25": sortable.isActiveDraggable,
		"transition-transform": !!state.active.draggable,
	});

	return (
		<Show
			when={props.customDragActivator}
			fallback={
				<div use:sortable classList={classList()}>
					{props.children(props.data, sortable)}
				</div>
			}
		>
			<div ref={sortable.ref} style={transformStyle(sortable.transform)} classList={classList()}>
				{props.children(props.data, sortable)}
			</div>
		</Show>
	);
}
