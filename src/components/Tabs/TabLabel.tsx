import { Icon, Icons } from "@components/Icon";

type Props = {
	label: string;
	icon: Icons;
	isActive: boolean;
};

export const TabLabel = (props: Props) => {
	return (
		<div
			class="flex-row-center space-x-2 justify-center"
			classList={{
				"text-neutral-100 font-medium": props.isActive,
				"text-neutral-400": !props.isActive,
			}}
		>
			<Icon name={props.icon} extraClass="w-4 h-4 fill-current" />
			<div>{props.label}</div>
		</div>
	);
};
