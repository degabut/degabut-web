import { Show, type Component, type JSX } from "solid-js";
import { Icon, type IconSize, type Icons } from "../icon";
import { Text } from "../text";

type Props = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
	rounded?: boolean;
	flat?: boolean;
	fill?: boolean;
	theme?: "brand" | "default" | "secondary";
	icon?: Icons;
	iconSize?: IconSize;
	iconClassList?: Record<string, boolean | undefined>;
	iconActive?: boolean;
};

export const Button: Component<Props> = (props) => {
	const classList = (): Record<string, boolean | undefined> => {
		if (props.theme === "brand") {
			if (props.flat) {
				return {
					"text-brand-800": props.disabled,
					"text-brand-600 hover:bg-white/5 active:bg-white/5": !props.disabled,
				};
			} else if (props.fill) {
				return {
					"text-neutral-850": true,
					"bg-brand-800": props.disabled,
					"bg-brand-600 hover:bg-brand-500 active:bg-brand-500": !props.disabled,
				};
			} else {
				return {
					"outline outline-1 outline-brand-800 text-brand-800": props.disabled,
					"outline outline-1 outline-brand-600 text-brand-600 hover:bg-white/5 active:bg-white/5":
						!props.disabled,
				};
			}
		} else if (props.theme === "secondary") {
			if (props.flat) {
				return {
					"text-neutral-700": props.disabled,
					"hover:text-neutral-100 text-neutral-400 hover:bg-white/5 active:bg-white/5": !props.disabled,
				};
			} else if (props.fill) {
				return {
					"text-neutral-900": true,
					"bg-neutral-400 hover:bg-neutral-200": !props.disabled,
					"bg-neutral-700": props.disabled,
				};
			} else {
				return {
					"outline outline-1 outline-neutral-800 bg-white/5 text-neutral-700": props.disabled,
					"outline outline-1 outline-neutral-600 text-neutral-400 hover:bg-white/5 active:bg-white/5":
						!props.disabled,
				};
			}
		} else {
			if (props.flat) {
				return {
					"text-neutral-500": props.disabled,
					"hover:text-white hover:bg-white/5 active:bg-white/5": !props.disabled,
				};
			} else if (props.fill) {
				return {
					"text-neutral-850": true,
					"bg-neutral-300 hover:bg-neutral-100": !props.disabled,
					"bg-neutral-500": props.disabled,
				};
			} else {
				return {
					"outline outline-1 outline-neutral-600 bg-white/5 text-neutral-500": props.disabled,
					"outline outline-1 outline-neutral-500 hover:bg-white/5 active:bg-white/5": !props.disabled,
				};
			}
		}
	};

	return (
		<button
			type="button"
			{...props}
			class="flex-row-center"
			classList={{
				"rounded-full": props.rounded,
				rounded: !props.rounded,
				...classList(),
				...props.classList,
				[props.class || ""]: !!props.class,
			}}
		>
			<Show when={props.icon} keyed>
				{(icon) => (
					<div class="relative">
						<Icon
							name={icon}
							size={props.iconSize || "md"}
							class="shrink-0"
							extraClassList={props.iconClassList}
						/>

						<Show when={props.iconActive}>
							<div class="absolute -bottom-[80%]">
								<Icon name="dot" size={props.iconSize || "md"} />
							</div>
						</Show>
					</div>
				)}
			</Show>

			<Show when={typeof props.children === "string"} fallback={props.children}>
				<Text.Body1>{props.children}</Text.Body1>
			</Show>
		</button>
	);
};
