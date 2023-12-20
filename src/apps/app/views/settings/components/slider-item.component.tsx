import { Slider } from "@common/components";
import { DelayUtil } from "@common/utils";
import { Component } from "solid-js";
import { Item, ValueProps } from "./item.component";

type Props = ValueProps<number> & {
	min: number;
	max: number;
	step?: number;
	onInput?: (v: number) => void;
};

export const SliderItem: Component<Props> = (props) => {
	const throttledOnInput = DelayUtil.throttle((e: { target: HTMLInputElement }) => {
		props.onInput?.(+e.target.value);
	}, 500);

	return (
		<Item {...props}>
			<Slider
				class="accent-brand-700 h-1.5"
				tooltip
				value={props.value()}
				onInput={throttledOnInput}
				onChange={(e) => props.onChange?.(e.target.valueAsNumber)}
				min={props.min}
				max={props.max}
				step={props.step || 1}
			/>
		</Item>
	);
};
