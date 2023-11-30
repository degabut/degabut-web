import { Motion } from "@motionone/solid";
import { Component, JSX, createSignal } from "solid-js";

type Props = {
	children: JSX.Element;
};

export const Card: Component<Props> = (props) => {
	const [isFlipped, setIsFlipped] = createSignal(false);

	return (
		<Motion.button
			class="h-80 w-52 relative rounded-lg"
			initial={false}
			hover={{ scale: isFlipped() ? 1 : 1.05 }}
			onClick={() => setIsFlipped(!isFlipped())}
			disabled={isFlipped()}
		>
			<Motion.div
				animate={{ rotateY: isFlipped() ? 0 : 180 }}
				initial={false}
				class="absolute inset-0 rounded-lg p-5 border border-brand"
				style={{ "backface-visibility": "hidden" }}
			>
				{props.children}
			</Motion.div>
			<Motion.div
				animate={{ rotateY: isFlipped() ? 180 : 0 }}
				initial={false}
				class="absolute inset-0 bg-neutral-950 rounded-lg border border-brand flex justify-center items-center"
				style={{ "backface-visibility": "hidden" }}
			>
				degabut logo
			</Motion.div>
		</Motion.button>
	);
};
