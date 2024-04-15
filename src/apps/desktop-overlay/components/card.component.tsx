import type { ParentComponent } from "solid-js";

type CardProps = {
	extraClass?: string;
	extraClassList?: Record<string, boolean>;
};

export const Card: ParentComponent<CardProps> = (props) => {
	return (
		<div
			class="bg-black/90 p-4 lg:p-6 2xl:p-8 rounded-lg truncate"
			classList={{
				[props.extraClass || ""]: !!props.extraClass,
				...props.extraClassList,
			}}
		>
			{props.children}
		</div>
	);
};
