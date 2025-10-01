import { Slider, Text, TimeUtil } from "@common";
import { createEffect, createSignal, type Component } from "solid-js";

type Props = {
	max: number;
	value: number;
	disabled?: boolean;
	dense?: boolean;
	viewOnly?: boolean;
	onChange?: (value: number) => void;
	extraLabelClass?: string;
};

export const QueueSeekSlider: Component<Props> = (props) => {
	let isSeeking = false;
	const [value, setValue] = createSignal(0);

	createEffect(() => {
		if (props.value > -1 && !isSeeking && !props.disabled) setValue(props.value);
	});

	const backgroundStyle = () => {
		const percentage = (Math.round(props.value) / props.max) * 100;
		const primary = props.disabled ? "#B8AE14" : "#ECE350";
		return `linear-gradient(to right, ${primary} 0%, ${primary} ${percentage}%, rgb(82 82 82) ${percentage}%, rgb(82 82 82) 100%)`;
	};

	const onChange = (value: number) => {
		props.onChange?.(value);
		isSeeking = false;
	};

	const onInput = (value: number) => {
		isSeeking = true;
		setValue(value);
	};

	return (
		<div
			class="w-full text-xs"
			classList={{
				"space-y-3 md:space-y-2.5": !props.dense,
				"space-y-1": props.dense,
			}}
		>
			<div
				class="flex-row-center justify-between"
				classList={{ invisible: props.max <= 0, [props.extraLabelClass || ""]: !!props.extraLabelClass }}
			>
				<Text.Caption2 light classList={{ "!text-xxs": props.dense }}>
					{TimeUtil.secondsToTime(Math.round(value()))}
				</Text.Caption2>
				<Text.Caption2 light classList={{ "!text-xxs": props.dense }}>
					{TimeUtil.secondsToTime(props.max)}
				</Text.Caption2>
			</div>

			<div class="flex items-center relative w-full">
				<div
					class="absolute w-full h-0.5"
					classList={{
						"opacity-100 block bg-neutral-800": props.max <= 0,
						"bg-neutral-600 opacity-100 hover:opacity-0": props.max > 0,
						"hidden md:block": !props.viewOnly,
					}}
				>
					<div
						class="absolute w-full bg-brand-500 h-0.5 max-w-full"
						style={{ width: `${props.max > 0 ? (value() / props.max) * 100 : 0}%` }}
					/>
				</div>

				<Slider
					class="absolute w-full h-0.5 appearance-none accent-brand-600"
					classList={{
						"!opacity-0": props.max <= 0,
						"opacity-0": props.viewOnly,
						"md:opacity-0 hover:opacity-100": !props.viewOnly,
					}}
					style={{ background: backgroundStyle() }}
					disabled={props.disabled}
					min={0}
					tooltip={(v) => TimeUtil.secondsToTime(Math.round(v))}
					onInput={(v) => onInput(+v.currentTarget.value)}
					onChange={(v) => onChange(+v.currentTarget.value)}
					max={props.max}
					value={value()}
				/>
			</div>
		</div>
	);
};
