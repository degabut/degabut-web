import { Component, JSX } from "solid-js";

type Props = JSX.InputHTMLAttributes<HTMLInputElement>;

export const Slider: Component<Props> = (props) => {
	return <input {...props} type="range" class="h-1" />;
};
