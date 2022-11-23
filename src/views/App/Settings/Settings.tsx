import { Button } from "@components/Button";
import { Container } from "@components/Container";
import { Divider } from "@components/Divider";
import { useApp } from "@hooks/useApp";
import { useNavigate } from "solid-app-router";
import { Component, onMount } from "solid-js";
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
				<div class="space-y-3">
					<div class="text-xl font-medium">Notification</div>
					<SwitchItem
						label="Enable Notification"
						checked={app.settings().notification}
						onChange={() => app.setSettings({ notification: !app.settings().notification })}
					/>
				</div>

				<Divider />

				<Button rounded class="max-w-max text-red-500 border-red-500 hover:bg-red-500/10" onClick={onLogout}>
					Logout
				</Button>
			</div>
		</Container>
	);
};
