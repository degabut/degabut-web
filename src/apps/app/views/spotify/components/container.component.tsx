import { ParentComponent } from "solid-js";

type ContainerProps = {
	extraClass?: string;
};

export const Container: ParentComponent<ContainerProps> = (props) => {
	return (
		<div
			class="h-full lg:overflow-y-auto bg-neutral-950 lg:rounded-lg px-3 lg:px-6 lg:py-8 py-4"
			classList={{ [props.extraClass || ""]: !!props.extraClass }}
		>
			{props.children}
		</div>
	);
};
