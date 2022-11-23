import { Button } from "@components/Button";
import { Container } from "@components/Container";
import { Divider } from "@components/Divider";
import { useApp } from "@hooks/useApp";
import { useNavigate } from "solid-app-router";
import { Component, onMount, Show } from "solid-js";
import { IS_DESKTOP } from "../../../constants";
import { SwitchItem } from "./components";

export const Settings: Component = () => {
	const app = useApp();
	const navigate = useNavigate();

	onMount(() => {
		app.setTitle("Settings");
	});

	const onLogout = () => {
		app.setConfirmation({
			title: "Logout",
			message: "Are you sure you want to logout?",
			onConfirm: () => {
				navigate("/login");
			},
		});
	};

	return (
		<Container size="sm" centered>
			<div class="flex flex-col space-y-8">
				<Show when={!IS_DESKTOP}>
					<div class="space-y-3">
						<div class="text-xl font-medium">Notification</div>
						<SwitchItem
							label="Enable Notification"
							checked={app.settings().notification}
							onChange={() => app.setSettings({ notification: !app.settings().notification })}
						/>
					</div>
				</Show>

				<Show when={IS_DESKTOP}>
					<div class="space-y-3">
						<div class="text-xl font-medium">Discord</div>
						<SwitchItem
							label="Enable Rich Presence"
							description="Show what you are currently listening to on Discord"
							checked={app.settings().discordRpc}
							onChange={() => app.setSettings({ discordRpc: !app.settings().discordRpc })}
						/>
					</div>
				</Show>
				<Divider />

				<Button rounded class="max-w-max text-red-500 border-red-500 hover:bg-red-500/10" onClick={onLogout}>
					Logout
				</Button>
			</div>
		</Container>
	);
};
