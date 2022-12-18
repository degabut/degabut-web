import { Button } from "@components/Button";
import { Container } from "@components/Container";
import { Divider } from "@components/Divider";
import { Text } from "@components/Text";
import { IS_DESKTOP } from "@constants";
import { useApp } from "@hooks/useApp";
import { useSettings } from "@hooks/useSettings";
import { useNavigate } from "@solidjs/router";
import { Component, onMount, Show } from "solid-js";
import { SwitchItem } from "./components";

export const Settings: Component = () => {
	const app = useApp();
	const { settings, setSettings } = useSettings();
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
				<div class="space-y-3">
					<Text.H2>Notification</Text.H2>
					<SwitchItem
						label="Enable Notification"
						checked={settings.notification}
						onChange={() => setSettings({ notification: !settings.notification })}
					/>
				</div>

				<Show when={IS_DESKTOP}>
					<div class="space-y-3">
						<Text.H2>Discord</Text.H2>
						<SwitchItem
							label="Enable Rich Presence"
							description="Show what you are currently listening to on Discord"
							checked={settings.discordRpc}
							onChange={() => setSettings({ discordRpc: !settings.discordRpc })}
						/>
					</div>
				</Show>

				<Divider />

				<Button
					rounded
					class="max-w-max text-red-500 border-red-500 hover:bg-red-500/10 px-8 py-1.5"
					onClick={onLogout}
				>
					Logout
				</Button>
			</div>
		</Container>
	);
};
