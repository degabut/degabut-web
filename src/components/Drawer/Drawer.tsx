import { ParentComponent } from "solid-js";

type Props = {
	isOpen?: boolean;
	handleClose?: () => void;
	extraContainerClass?: string;
};

export const Drawer: ParentComponent<Props> = (props) => {
	return (
		<div class={`h-full absolute md:static top-0 z-20 ${props.extraContainerClass}`}>
			{props.isOpen && (
				<div
					class="block md:hidden fixed w-screen h-screen top-0 left-0 bg-black bg-opacity-50 -z-50"
					onClick={props.handleClose}
				/>
			)}

			<div
				class="relative flex flex-col h-full w-[16rem] max-w-[90vw] bg-black overflow-y-auto overflow-x-hidden"
				classList={{ hidden: !props.isOpen }}
			>
				{props.children}
			</div>
		</div>
	);
};
