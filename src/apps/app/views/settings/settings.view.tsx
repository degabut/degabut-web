import { useApp, useSettings } from "@app/hooks";
import { Button, Container, Divider, Text } from "@common/components";
import { IS_DESKTOP } from "@constants";
import { useDesktop } from "@desktop/hooks";
import { useNavigate } from "@solidjs/router";
import { Accessor, Component, For, JSX, Show, onMount } from "solid-js";
import { Item, KeybindItem, SwitchItem, TextItem } from "./components";

type SettingsCategory = {
	label: string;
	desktopOnly?: boolean;
	items: SettingsItem[];
};

type SettingsItem = {
	label: string;
	description?: string;
	hide?: boolean;
} & (
	| {
			type: "switch";
			value: Accessor<boolean>;
			onChange: (v: boolean) => void;
	  }
	| {
			type: "keybind";
			value: Accessor<string[]>;
			onChange: (v: string[]) => void;
	  }
	| {
			type: "text" | "password";
			value: Accessor<string>;
			onChange: (v: string) => void;
	  }
	| {
			type: "element";
			element: Accessor<JSX.Element>;
	  }
);

export const Settings: Component = () => {
	const app = useApp();
	const desktop = useDesktop();
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
					label: "Enable In App Notifications",
					type: "switch",
					value: () => settings["notification.inApp"],
					onChange: () => setSettings("notification.inApp", (v) => !v),
				},
				{
					label: "Enable Browser Notifications",
					type: "switch",
					value: () => settings["notification.browser"],
					onChange: () => setSettings("notification.browser", (v) => !v),
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
					value: () => settings["discord.richPresence"],
					onChange: () => setSettings("discord.richPresence", (v) => !v),
				},
				{
					label: "Enable RPC Features",
					type: "switch",
					description: "Experimental!",
					value: () => settings["discord.rpc"],
					onChange: () => setSettings("discord.rpc", (v) => !v),
				},
				{
					label: "RPC Client Id",
					type: "text",
					hide: !settings["discord.rpc"],
					value: () => settings["discord.rpcClientId"],
					onChange: (v) => setSettings("discord.rpcClientId", v),
				},
				{
					label: "RPC Client Secret",
					type: "password",
					hide: !settings["discord.rpc"],
					value: () => settings["discord.rpcClientSecret"],
					onChange: (v) => setSettings("discord.rpcClientSecret", v),
				},
				{
					type: "element",
					label: "",
					hide: !settings["discord.rpc"],
					element: () => (
						<Button
							class="px-2 py-0.5"
							onClick={desktop.authenticateRpc}
							disabled={!settings["discord.rpcClientId"] || !settings["discord.rpcClientSecret"]}
						>
							<Text.Body2>Authenticate</Text.Body2>
						</Button>
					),
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
					value: () => settings["overlay.enabled"],
					onChange: () => setSettings("overlay.enabled", (v) => !v),
				},
				{
					label: "Overlay Shortcut",
					type: "keybind",
					value: () => settings["overlay.shortcut"],
					onChange: (v) => setSettings("overlay.shortcut", v),
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
								<For each={c.items.filter((i) => !i.hide)}>
									{(i) => (
										<>
											{i.type === "keybind" && <KeybindItem {...i} />}
											{i.type === "switch" && <SwitchItem {...i} />}
											{(i.type === "text" || i.type === "password") && <TextItem {...i} />}
											{i.type === "element" && <Item {...i}>{i.element()}</Item>}
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
					class="max-w-max text-red-500 !border-red-500 hover:bg-red-500/10 px-8 py-1.5"
					onClick={onClickLogout}
				>
					Logout
				</Button>
			</div>
		</Container>
	);
};