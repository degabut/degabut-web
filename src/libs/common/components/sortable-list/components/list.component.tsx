import { createSortable, transformStyle, useDragDropContext } from "@thisbeyond/solid-dnd";
import { type JSX } from "solid-js";
import { Dynamic } from "solid-js/web";

type Props<Data> = {
	initialId: string;
	data: Data;
	children: (data: Data, sortable: ReturnType<typeof createSortable>) => JSX.Element;
	element?: keyof JSX.IntrinsicElements;
	customDragActivator?: boolean;
};

export function List<Data>(props: Props<Data>) {
	const sortable = createSortable(props.initialId);
	const [state] = useDragDropContext()!;

	return (
		<Dynamic
			component={props.element || "div"}
			ref={sortable.ref}
			style={transformStyle(sortable.transform)}
			classList={{
				"focus-within:opacity-25": sortable.isActiveDraggable,
				"transition-transform": !!state.active.draggable,
			}}
			{...(!props.customDragActivator ? sortable.dragActivators : {})}
		>
			{props.children(props.data, sortable)}
		</Dynamic>
	);
}
