import { For, Show, type Component } from "solid-js";

type KbdProps = { key: string; small?: boolean; extraClass?: string };

const Kbd: Component<KbdProps> = (props) => {
	return (
		<kbd
			class="border rounded border-neutral-300"
			classList={{
				"px-2.5 py-0.5 ": !props.small,
				"px-1.5 py-0.5 text-xs": props.small,
				[props.extraClass || ""]: !!props.extraClass,
			}}
		>
			{props.key}
		</kbd>
	);
};

type Props = {
	key?: string;
	keys?: string[];
	combination?: string[];
	extraKbdClass?: string;
	label?: string;
	small?: boolean;
};

export const KeyboardHint: Component<Props> = (props) => {
	return (
		<div class="flex-row-center space-x-2">
			<Show when={props.key} keyed>
				{(key) => <Kbd small={props.small} key={key} extraClass={props.extraKbdClass} />}
			</Show>

			<For each={props.keys}>
				{(key) => <Kbd small={props.small} key={key} extraClass={props.extraKbdClass} />}
			</For>

			<Show when={props.combination}>
				<div class="flex-row-center space-x-1">
					<For each={props.combination}>
						{(key, i) => (
							<>
								<Show when={i() > 0}>
									<div class="text-neutral-400" classList={{ "text-xs": props.small }}>
										+
									</div>
								</Show>
								<Kbd small={props.small} key={key} extraClass={props.extraKbdClass} />
							</>
						)}
					</For>
				</div>
			</Show>

			<Show when={props.label}>
				<div class="text-neutral-300">{props.label}</div>
			</Show>
		</div>
	);
};
