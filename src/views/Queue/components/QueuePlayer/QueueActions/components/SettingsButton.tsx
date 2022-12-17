import { Button } from "@components/Button";
import { ContextMenuItem } from "@components/ContextMenu";
import { IconSize } from "@components/Icon";
import { contextMenu } from "@directives/contextMenu";
import { useApp } from "@hooks/useApp";
import { useNavigate } from "@solidjs/router";
import { Component } from "solid-js";

contextMenu;

type Props = {
	onClearQueue: () => void;
	extraClass?: string;
	iconSize?: IconSize;
};

export const SettingsButton: Component<Props> = (props) => {
	const app = useApp();
	const navigate = useNavigate();

	const contextMenuItems = () => [
		{
			element: () => <ContextMenuItem icon="stars" label="Zen Mode" />,
			onClick: () => navigate("/app/queue/zen"),
		},
		{
			element: () => <ContextMenuItem icon="trashBin" label="Clear Queue" />,
			onClick: () =>
				app.setConfirmation({
					title: "Clear Queue",
					message: "Are you sure you want to clear the queue?",
					onConfirm: props.onClearQueue,
				}),
		},
	];

	return (
		<div
			use:contextMenu={{
				items: [contextMenuItems()],
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
