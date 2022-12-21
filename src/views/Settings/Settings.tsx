import { Button } from "@components/Button";
import { Container } from "@components/Container";
import { Divider } from "@components/Divider";
import { Text } from "@components/Text";
import { IS_DESKTOP } from "@constants";
import { useSettings } from "@hooks/useSettings";
import { useApp } from "@providers/AppProvider";
import { useNavigate } from "@solidjs/router";
import { Accessor, Component, For, onMount, Show } from "solid-js";
import { KeybindItem, SwitchItem } from "./components";

type SettingsCategory = {
	label: string;
	desktopOnly?: boolean;
	items: SettingsItem[];
};

type SettingsItem = {
	label: string;
	description?: string;
} & (
	| {
			type: "switch";
			value: boolean;
			onChange: (v: boolean) => void;
	  }
	| {
			type: "keybind";
			value: string[];
			onChange: (v: string[]) => void;
	  }
);

export const Settings: Component = () => {
	const app = useApp();
	const { settings, setSettings } = useSettings();
	const navigate = useNavigate();

	onMount(() => app.setTitle("Settings"));

	const onClickLogout = () => {
		app.setConfirmation({
			title: "Logout",
			message: "Are you sure you want to logout?",
			onConfirm: () => navigate("/login"),
		});
	};

	const categories: Accessor<SettingsCategory[]> = () => [
		{
			label: "Notification",
			items: [
				{
					label: "Enable Notification",
					type: "switch",
					value: settings.notification,
					onChange: () => setSettings({ notification: !settings.notification }),
				},
			],
		},
		{
			label: "Discord",
			desktopOnly: true,
			items: [
				{
					label: "Enable Rich Presence",
					type: "switch",
					description: "Show what you are currently listening to on Discord",
					value: settings.discordRpc,
					onChange: () => setSettings({ discordRpc: !settings.discordRpc }),
				},
			],
		},
		{
			label: "Overlay",
			desktopOnly: true,
			items: [
				{
					label: "Enable Overlay",
					type: "switch",
					value: settings.overlay,
					onChange: () => setSettings({ overlay: !settings.overlay }),
				},
				{
					label: "Overlay Shortcut",
					type: "keybind",
					value: settings.overlayShortcut,
					onChange: (v) => setSettings({ overlayShortcut: v }),
				},
			],
		},
	];

	return (
		<Container size="sm" centered>
			<div class="flex flex-col space-y-8">
				<For each={categories()}>
					{(c) => (
						<Show when={c.desktopOnly ? IS_DESKTOP : true}>
							<div class="space-y-4">
								<Text.Caption1 class="uppercase font-medium">{c.label}</Text.Caption1>
								<For each={c.items}>
									{(i) => (
										<>
											{i.type === "keybind" && (
												<KeybindItem
													label={i.label}
													description={i.description}
													value={i.value}
													onChange={(v) => i.onChange(v)}
												/>
											)}
											{i.type === "switch" && (
												<SwitchItem
													label={i.label}
													description={i.description}
													checked={i.value}
													onChange={(v) => i.onChange(v)}
												/>
											)}
										</>
									)}
								</For>
							</div>

							<Divider />
						</Show>
					)}
				</For>

				<Button
					rounded
					class="max-w-max text-red-500 border-red-500 hover:bg-red-500/10 px-8 py-1.5"
					onClick={onClickLogout}
				>
					Logout
				</Button>
			</div>
		</Container>
	);
};
