import { Slider } from "@common/components";
import { DelayUtil } from "@common/utils";
import { Component } from "solid-js";
import { Item, ValueProps } from "./item.component";

type Props = ValueProps<number> & {
	min: number;
	max: number;
	step?: number;
};

export const SliderItem: Component<Props> = (props) => {
	const throttledOnInput = DelayUtil.throttle((e: { target: HTMLInputElement }) => {
		props.onChange(+e.target.value);
	}, 500);

	return (
		<Item {...props}>
			<Slider
				class="accent-brand-700 h-1.5"
				value={props.value()}
				onInput={throttledOnInput}
				min={props.min}
				max={props.max}
				step={props.step || 1}
			/>
		</Item>
	);
};
