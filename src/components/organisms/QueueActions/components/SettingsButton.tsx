import { Button, IconSize } from "@components/atoms";
import { ContextMenuItem } from "@components/molecules";
import { contextMenu } from "@directives/contextMenu";
import { useApp } from "@hooks/useApp";
import { useNavigate } from "@solidjs/router";
import { Component } from "solid-js";

contextMenu;

type Props = {
	onClearQueue: () => void;
	onStopQueue: () => void;
	extraClass?: string;
	iconSize?: IconSize;
};

export const SettingsButton: Component<Props> = (props) => {
	const app = useApp();
	const navigate = useNavigate();

	const contextMenuItems = () => [
		{
			element: () => <ContextMenuItem label="Zen Mode" />,
			onClick: () => navigate("/app/queue/zen"),
		},
		{
			element: () => <ContextMenuItem label="Clear Queue" />,
			onClick: () =>
				app.setConfirmation({
					title: "Clear Queue",
					message: "Are you sure you want to clear the queue?",
					onConfirm: props.onClearQueue,
				}),
		},
		{
			element: () => <ContextMenuItem label="Stop" />,
			onClick: () =>
				app.setConfirmation({
					title: "Stop",
					message: "Are you sure you want to stop and destroy the queue?",
					onConfirm: props.onStopQueue,
				}),
		},
	];

	return (
		<div
			use:contextMenu={{
				items: contextMenuItems(),
				header: () => (
					<div class="flex-col-center justify-center pt-4 pb-8 space-y-1">
						<div class="flex-col-center space-y-2">
							<div class="font-medium text-center">Queue Settings</div>
						</div>
					</div>
				),
				openWithClick: true,
			}}
		>
			<Button
				flat
				class="p-2"
				icon="gear"
				iconSize={props.iconSize || "lg"}
				title="Settings"
				classList={{
					[props.extraClass || ""]: !!props.extraClass,
				}}
			/>
		</div>
	);
};
