import { Button, Divider, Modal, Switch, Text } from "@common";
import { useQueue, type QueueAutoplayType } from "@queue";
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

const autoplayPresets = {
	queueLastPlayedRelated: ["QUEUE_LAST_PLAYED_RELATED"],
	queueRelated: ["QUEUE_RELATED"],
	userLibrary: ["USER_RECENTLY_LIKED", "USER_RECENTLY_PLAYED", "USER_RECENT_MOST_PLAYED", "USER_OLD_MOST_PLAYED"],
	userLibraryRelated: [
		"USER_RECENTLY_LIKED_RELATED",
		"USER_RECENTLY_PLAYED_RELATED",
		"USER_RECENT_MOST_PLAYED_RELATED",
		"USER_OLD_MOST_PLAYED_RELATED",
	],
} as const;

export const AutoplayOptionsModal: Component<AutoplayOptionsModalProps> = (props) => {
	const queue = useQueue()!;
	const [presets, setPresets] = createSignal<
		Record<keyof typeof autoplayPresets, boolean> & { normalDuration: boolean }
	>({
		normalDuration: false,
		queueLastPlayedRelated: true,
		queueRelated: true,
		userLibrary: true,
		userLibraryRelated: true,
	});

	createEffect(() => {
		if (props.isOpen) {
			const options = queue.data.autoplayOptions;

			const { queueLastPlayedRelated, queueRelated, userLibrary, userLibraryRelated } = autoplayPresets;
			setPresets({
				normalDuration: options.minDuration === 60 && options.maxDuration === 600,
				queueLastPlayedRelated: queueLastPlayedRelated.every((t) => options.types.includes(t)),
				queueRelated: queueRelated.every((t) => options.types.includes(t)),
				userLibrary: userLibrary.every((t) => options.types.includes(t)),
				userLibraryRelated: userLibraryRelated.every((t) => options.types.includes(t)),
			});
		}
	});

	const saveOptions = () => {
		const types: QueueAutoplayType[] = [];
		let maxDuration: number | null = null;
		let minDuration: number | null = null;

		if (presets().queueLastPlayedRelated) types.push(...autoplayPresets.queueLastPlayedRelated);
		if (presets().queueRelated) types.push(...autoplayPresets.queueRelated);
		if (presets().userLibrary) types.push(...autoplayPresets.userLibrary);
		if (presets().userLibraryRelated) types.push(...autoplayPresets.userLibraryRelated);
		if (presets().normalDuration) {
			maxDuration = 600;
			minDuration = 60;
		}

		queue.changeAutoplayOptions({ maxDuration, minDuration, types });
	};

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
						isEnabled={presets().normalDuration}
						onToggle={() =>
							setPresets((o) => ({
								...o,
								normalDuration: !o.normalDuration,
							}))
						}
					/>

					<OptionItem
						label="Include Song Related to the Queue"
						isEnabled={presets().queueLastPlayedRelated}
						onToggle={() =>
							setPresets((o) => ({
								...o,
								queueLastPlayedRelated: !o.queueLastPlayedRelated,
							}))
						}
					/>

					<OptionItem
						label="Include Random Song"
						isEnabled={presets().queueRelated}
						onToggle={() =>
							setPresets((o) => ({
								...o,
								queueRelated: !o.queueRelated,
							}))
						}
					/>

					<OptionItem
						label="Include Song from User Library"
						isEnabled={presets().userLibrary}
						onToggle={() =>
							setPresets((o) => ({
								...o,
								userLibrary: !o.userLibrary,
							}))
						}
					/>

					<OptionItem
						label="Include Related Song from User Library"
						isEnabled={presets().userLibraryRelated}
						onToggle={() =>
							setPresets((o) => ({
								...o,
								userLibraryRelated: !o.userLibraryRelated,
							}))
						}
					/>
				</div>

				<div class="flex-row-center justify-center space-x-2.5 px-2 md:px-8">
					<Button
						class="px-6 py-2"
						onClick={() => {
							saveOptions();
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
