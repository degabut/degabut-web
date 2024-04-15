import { Show, createEffect, createSignal, type Component, type JSX } from "solid-js";
import { Text } from "../text";

type Props = JSX.InputHTMLAttributes<HTMLInputElement> & {
	min: number;
	max: number;
	tooltip?: boolean | ((value: number) => JSX.Element);
};

export const Slider: Component<Props> = (props) => {
	let inputRef!: HTMLInputElement;
	let tooltipRef!: HTMLSpanElement;
	const [value, setValue] = createSignal(props.value ? +props.value : 0);
	const [isDragging, setIsDragging] = createSignal(false);
	const [tooltipPosition, setTooltipPosition] = createSignal({ x: 0, y: 0 });

	createEffect(() => {
		if (!props.tooltip) return;
		if (isDragging()) window.addEventListener("mousemove", onMouseMove);
		else window.removeEventListener("mousemove", onMouseMove);
	});

	const onMouseDown = (e: MouseEvent) => {
		setTimeout(() => {
			setIsDragging(true);
			onMouseMove(e);
		}, 0);
	};

	const onMouseUp = () => {
		setIsDragging(false);
	};

	const onMouseMove = (e: MouseEvent) => {
		const tooltipRect = tooltipRef.getBoundingClientRect();
		const inputRect = inputRef.getBoundingClientRect();
		const halfThumbWidth = 8;

		const value = (e.target as HTMLInputElement).valueAsNumber;
		const step = props.step ? +props.step : 1;
		const totalSteps = (props.max - props.min) / step;
		const valueSteps = (value - props.min) / step;
		const valueRatio = valueSteps / totalSteps;

		let x = inputRect.left + halfThumbWidth + (inputRect.width - halfThumbWidth) * valueRatio - halfThumbWidth;
		if (x + tooltipRect.width > window.innerWidth) x = window.innerWidth - tooltipRect.width;
		const y = inputRect.top;

		setTooltipPosition({ x, y });
	};

	const onInput = (e: InputEvent & { currentTarget: HTMLInputElement; target: HTMLInputElement }) => {
		const value = +(e.target as HTMLInputElement).value;
		setValue(value);
		if (typeof props.onInput === "function") props.onInput(e);
	};

	return (
		<>
			<Show when={isDragging() && props.tooltip}>
				<Text.Caption2
					ref={tooltipRef}
					class="fixed bg-neutral-700 px-1.5 py-0.5 rounded !text-neutral-100 !m-0"
					style={{
						left: `${tooltipPosition().x}px`,
						top: `calc(${tooltipPosition().y}px - 2rem)`,
					}}
				>
					{props.tooltip === true ? value() : typeof props.tooltip === "function" && props.tooltip(value())}
				</Text.Caption2>
			</Show>

			<input
				ref={inputRef}
				{...props}
				type="range"
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
				onInput={onInput}
			/>
		</>
	);
};
