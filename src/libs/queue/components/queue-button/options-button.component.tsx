import { useApp } from "@app/hooks";
import { Button, Checkbox, Text, contextMenu, type IconSize } from "@common";
import type { Component } from "solid-js";

contextMenu;

type Props = {
	onClearQueue: (removeNowPlaying: boolean) => void;
	onStopQueue: () => void;
	disabled?: boolean;
	extraClass?: string;
	iconSize?: IconSize;
};

export const OptionsButton: Component<Props> = (props) => {
	const app = useApp();

	// TODO move this
	const contextMenuItems = () => [
		{
			label: "Clear Queue",
			onClick: () => {
				app.setConfirmation({
					title: "Clear Queue",
					state: { removeNowPlaying: true },
					message: (state, setState) => {
						return (
							<div class="flex flex-col space-y-6">
								<Text.Body1 class="text-center">Are you sure you want to clear the queue?</Text.Body1>
								<div
									class="flex flex-row justify-center items-center space-x-2"
									onClick={() => setState("removeNowPlaying", (v) => !v)}
								>
									<Checkbox checked={state.removeNowPlaying} />
									<Text.Caption1>Remove currently playing song</Text.Caption1>
								</div>
							</div>
						);
					},
					onConfirm: (state) => props.onClearQueue(state.removeNowPlaying),
				});
			},
		},
		{
			label: "Disconnect",
			onClick: () => {
				app.setConfirmation({
					title: "Disconnect",
					message: "Are you sure you want to stop and destroy the queue?",
					onConfirm: props.onStopQueue,
				});
			},
		},
	];

	return (
		<div
			use:contextMenu={{
				items: contextMenuItems(),
				header: (
					<div class="flex-col-center justify-center pt-4 pb-8 space-y-1">
						<div class="flex-col-center space-y-2">
							<div class="font-medium text-center">Queue Options</div>
						</div>
					</div>
				),
				openWithClick: true,
			}}
		>
			<Button
				flat
				disabled={props.disabled}
				class="p-2 text-neutral-300"
				icon="gearPlay"
				iconSize={props.iconSize || "lg"}
				title="Settings"
				classList={{
					[props.extraClass || ""]: !!props.extraClass,
				}}
			/>
		</div>
	);
};
