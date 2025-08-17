import { Button, Divider, Modal, Switch, Text } from "@common";
import { useQueue, type IAutoplayOptions } from "@queue";
import { createEffect, createSignal, Show, type Component } from "solid-js";

type OptionItemProps = {
	label: string;
	description?: string;
	isEnabled: boolean;
	onToggle: (value: boolean) => void;
};

const OptionItem: Component<OptionItemProps> = (props) => {
	return (
		<div class="flex justify-between flex-col md:flex-row md:space-x-4 md:items-center">
			<div class="flex flex-col">
				<Text.Body1>{props.label}</Text.Body1>
				<Show when={props.description} keyed>
					{(description) => <Text.Caption1>{description}</Text.Caption1>}
				</Show>
			</div>

			<Switch checked={props.isEnabled} onChange={props.onToggle} />
		</div>
	);
};

type AutoplayOptionsModalProps = {
	isOpen: boolean;
	handleClose: () => void;
};

export const AutoplayOptionsModal: Component<AutoplayOptionsModalProps> = (props) => {
	const queue = useQueue()!;
	const [options, setOptions] = createSignal<IAutoplayOptions>({ ...queue.data.autoplayOptions });

	createEffect(() => {
		if (props.isOpen) {
			setOptions({ ...queue.data.autoplayOptions });
		}
	});

	return (
		<Modal
			isOpen={props.isOpen}
			closeOnEscape
			handleClose={() => props.handleClose()}
			extraContainerClass="w-[32rem]"
		>
			<div class="flex flex-col space-x-2.5 py-4 md:py-8 h-full">
				<div class="px-2 md:px-8">
					<Text.H2 class="text-center mb-4">Autoplay Options</Text.H2>
					<Divider />
				</div>

				<div class="flex flex-col py-8 px-4 md:px-8 space-y-2.5 overflow-auto">
					<OptionItem
						label="Normal Music Duration Only"
						isEnabled={options().minDuration === 60 && options().maxDuration === 600}
						onToggle={() =>
							setOptions((o) => ({
								...o,
								minDuration: 60,
								maxDuration: 600,
							}))
						}
					/>

					<OptionItem
						label="Include Song Related to the Queue"
						isEnabled={options().includeQueueLastPlayedRelated}
						onToggle={() =>
							setOptions((o) => ({
								...o,
								includeQueueLastPlayedRelated: !o.includeQueueLastPlayedRelated,
							}))
						}
					/>

					<OptionItem
						label="Include Random Song"
						isEnabled={options().includeQueueRelated}
						onToggle={() =>
							setOptions((o) => ({
								...o,
								includeQueueRelated: !o.includeQueueRelated,
							}))
						}
					/>

					<OptionItem
						label="Include Song from User Library"
						isEnabled={options().includeUserLibrary}
						onToggle={() =>
							setOptions((o) => ({
								...o,
								includeUserLibrary: !o.includeUserLibrary,
							}))
						}
					/>
				</div>

				<div class="flex-row-center justify-center space-x-2.5 px-2 md:px-8">
					<Button
						class="px-6 py-2"
						onClick={() => {
							queue.changeAutoplayOptions(options());
							props.handleClose();
						}}
					>
						Save
					</Button>
				</div>
			</div>
		</Modal>
	);
};
