import { Slider, Text } from "@common";
import type { Component } from "solid-js";
import { Item, type ValueProps } from "./item.component";

export type SliderItemProps = ValueProps<number> & {
	min: number;
	max: number;
	step?: number;
};

export const SliderItem: Component<SliderItemProps> = (props) => {
	return (
		<Item {...props}>
			<div
				class="flex items-center justify-center"
				classList={{
					"flex-col space-y-2.5": props.vertical,
					"flex-row space-x-2.5": !props.vertical,
				}}
			>
				<Text.Caption2 class="w-8" classList={{ "text-right": !props.vertical, "text-center": props.vertical }}>
					{props.value()}
				</Text.Caption2>
				<Slider
					class="accent-brand-700 w-full"
					classList={{ "opacity-25": props.disabled }}
					style={{
						appearance: props.vertical ? ("slider-vertical" as any) : undefined,
						direction: props.vertical ? "rtl" : undefined,
						"writing-mode": props.vertical ? "vertical-lr" : undefined,
					}}
					value={props.value()}
					onInput={(e) => props.onInput?.(e.target.valueAsNumber)}
					min={props.min}
					max={props.max}
					step={props.step || 1}
					disabled={props.disabled}
				/>
			</div>
		</Item>
	);
};
