import { Component, JSX, onCleanup, onMount } from "solid-js";

export type InputProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "prefix"> & {
	rounded?: boolean;
	outlined?: boolean;
	focusOnMount?: boolean;
	prefix?: JSX.Element;
	suffix?: JSX.Element;
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
			class={`flex flex-row items-center ${props.class}`}
			classList={{
				"bg-transparent border border-neutral-400 text-neutral-100 rounded": props.outlined,
				"bg-white text-black": !props.outlined,
				"rounded-full": !!props.rounded,
				rounded: !props.rounded,
				"bg-neutral-300 text-neutral-500": !!props.disabled,
				"pl-3": !!props.prefix,
				"pr-3": !!props.suffix,
				...props.classList,
			}}
		>
			{props.prefix}
			<input
				ref={input}
				{...props}
				prefix={undefined}
				class="outline-0 py-2 px-4 flex-grow w-full bg-transparent"
				classList={{
					"rounded-full": !!props.rounded,
					"!pl-3": !!props.prefix,
					"!pr-3": !!props.suffix,
				}}
			/>
			{props.suffix}
		</div>
	);
};
