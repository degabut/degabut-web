import { ContextMenuItem } from "@components/ContextMenu";
import { Icon } from "@components/Icon";
import { contextMenu } from "@directives/contextMenu";
import { useApp } from "@hooks/useApp";
import { Component } from "solid-js";

contextMenu;

type Props = {
	onClearQueue: () => void;
};

export const SettingsButton: Component<Props> = (props) => {
	const app = useApp();

	const contextMenuItems = () => [
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
		<button
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
			class="p-2"
			title="Settings"
		>
			<Icon name="gear" extraClass="w-5 h-5 fill-neutral-300 hover:fill-white" />
		</button>
	);
};
