import { useApp } from "@app/hooks";
import { Button, Container, Divider, Text } from "@common/components";
import { TimeUtil } from "@common/utils";
import { APP_VERSION, DESKTOP_APP_VERSION, IS_DESKTOP } from "@constants";
import { useDesktop } from "@desktop/hooks";
import { useSettings } from "@settings/hooks";
import { useNavigate } from "@solidjs/router";
import { Accessor, Component, For, JSX, Show, onMount } from "solid-js";
import { Item, KeybindItem, SliderItem, SwitchItem, TextItem } from "./components";

type SettingsCategory = {
	label: string;
	show?: boolean;
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
			type: "slider";
			min: number;
			max: number;
			step?: number;
			value: Accessor<number>;
			onChange: (v: number) => void;
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
			show: IS_DESKTOP,
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
							onClick={() =>
								desktop?.ipc.authenticateRpc?.(
									settings["discord.rpcClientId"],
									settings["discord.rpcClientSecret"]
								)
							}
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
			show: IS_DESKTOP,
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
		{
			label: "❄ Snowfall ❄",
			show: TimeUtil.isNearNewYear(),
			items: [
				{
					label: "Enable Snowfall",
					type: "switch",
					value: () => settings["app.snowfall.enabled"],
					onChange: () => setSettings("app.snowfall.enabled", (v) => !v),
				},
				{
					label: "Snowfall Speed",
					type: "slider",
					min: 1,
					max: 100,
					value: () => settings["app.snowfall.speed"],
					onChange: (v) => setSettings("app.snowfall.speed", v),
				},
				{
					label: "Snowfall Amount",
					type: "slider",
					min: 1,
					max: 100,
					value: () => settings["app.snowfall.amount"],
					onChange: (v) => setSettings("app.snowfall.amount", v),
				},
			],
		},
	];

	return (
		<Container size="sm" centered>
			<div class="flex flex-col space-y-8">
				<For each={categories()}>
					{(c) => (
						<Show when={"show" in c ? c.show : true}>
							<div class="space-y-4">
								<Text.Caption1 class="uppercase font-medium">{c.label}</Text.Caption1>
								<For each={c.items.filter((i) => !i.hide)}>
									{(i) => (
										<>
											{i.type === "keybind" && <KeybindItem {...i} />}
											{i.type === "switch" && <SwitchItem {...i} />}
											{(i.type === "text" || i.type === "password") && <TextItem {...i} />}
											{i.type === "slider" && <SliderItem {...i} />}
											{i.type === "element" && <Item {...i}>{i.element()}</Item>}
										</>
									)}
								</For>
							</div>

							<Divider />
						</Show>
					)}
				</For>

				<div class="flex flex-row justify-between">
					<Button
						rounded
						class="max-w-max text-red-500 !border-red-500 hover:bg-red-500/10 px-8 py-1.5"
						onClick={onClickLogout}
					>
						Logout
					</Button>

					<div class="flex flex-col text-right">
						<Show when={DESKTOP_APP_VERSION} keyed fallback={<Text.Caption2>v{APP_VERSION}</Text.Caption2>}>
							{(v) => (
								<>
									<Text.Caption2>Desktop: v{v}</Text.Caption2>
									<Text.Caption2>Web: v{APP_VERSION}</Text.Caption2>
								</>
							)}
						</Show>
					</div>
				</div>
			</div>
		</Container>
	);
};
