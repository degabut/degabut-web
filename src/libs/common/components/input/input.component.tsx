import { Accessor, Component, JSX, onCleanup, onMount } from "solid-js";

export type InputProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "prefix"> & {
	rounded?: boolean;
	outlined?: boolean;
	dense?: boolean;
	focusOnMount?: boolean;
	prefix?: Accessor<JSX.Element>;
	suffix?: Accessor<JSX.Element>;
};

export const Input: Component<InputProps> = (props) => {
	let input!: HTMLInputElement;

	onMount(() => {
		if (props.focusOnMount) input.focus();
		input.addEventListener("keydown", onKeyDown);
	});

	onCleanup(() => {
		input.removeEventListener("keydown", onKeyDown);
	});

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape") input.blur();
	};

	return (
		<div
			class="flex flex-row items-center"
			classList={{
				"bg-transparent border border-neutral-500 text-current rounded": props.outlined,
				"bg-white text-black": !props.outlined,
				"rounded-full": props.rounded,
				rounded: !props.rounded,
				"bg-neutral-300 text-neutral-500": props.disabled,
				"pl-3": !!props.prefix && !props.dense,
				"pr-3": !!props.suffix && !props.dense,
				"pl-1.5": !!props.prefix && props.dense,
				"pr-1.5": !!props.suffix && props.dense,
				...props.classList,
				[props.class || ""]: !!props.class,
			}}
		>
			{props.prefix?.()}
			<input
				ref={input}
				{...props}
				prefix={undefined}
				class="outline-0 grow w-full bg-transparent font-normal"
				classList={{
					"rounded-full": !!props.rounded,
					"!pl-3": !!props.prefix && !props.dense,
					"!pr-3": !!props.suffix && !props.dense,
					"!pl-1.5": !!props.prefix && props.dense,
					"!pr-1.5": !!props.suffix && props.dense,
					"py-2 px-4": !props.dense,
					"py-1 px-2": props.dense,
				}}
			/>
			{props.suffix?.()}
		</div>
	);
};
