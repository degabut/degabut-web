import { useApp } from "@app/hooks";
import { Button, Container, Divider, Text } from "@common/components";
import { TimeUtil } from "@common/utils";
import {
	APP_VERSION,
	DESKTOP_APP_VERSION,
	IS_DESKTOP,
	IS_DISCORD_EMBEDDED,
	SPOTIFY_CLIENT_ID,
	SPOTIFY_INTEGRATION,
} from "@constants";
import { useDesktop } from "@desktop/hooks";
import { useSettings } from "@settings/hooks";
import { useNavigate } from "@solidjs/router";
import { useSpotify } from "@spotify/hooks";
import { Accessor, Component, For, JSX, JSXElement, Show, createSignal, onMount } from "solid-js";
import { Item, KeybindItem, SliderItem, SwitchItem, TextItem } from "./components";
import { SpotifyIntegrationTutorialModal } from "./components/spotify-integration-tutorial-modal.component";

type SettingsCategory = {
	label: string;
	show?: boolean;
	items: SettingsItem[];
};

type SettingsItemParams<Type, ValueType, Extra = object> = {
	type: Type;
	value: Accessor<ValueType>;
	onChange?: (v: ValueType) => void;
} & Extra;

type SettingsItem = {
	label: string;
	description?: string | (() => JSXElement);
	hide?: boolean;
	disabled?: boolean;
} & (
	| SettingsItemParams<"switch", boolean>
	| SettingsItemParams<"keybind", string[]>
	| SettingsItemParams<"text" | "password", string>
	| SettingsItemParams<
			"slider",
			number,
			{
				onInput?: (v: number) => void;
				min: number;
				max: number;
				step?: number;
			}
	  >
	| {
			type: "element";
			element: Accessor<JSX.Element>;
	  }
);

export const Settings: Component = () => {
	const app = useApp();
	const desktop = useDesktop();
	const spotify = useSpotify();
	const { settings, setSettings } = useSettings();
	const navigate = useNavigate();
	const [isSpotifyTutorialOpen, setIsSpotifyTutorialOpen] = createSignal(false);

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
					hide: IS_DISCORD_EMBEDDED,
					value: () => settings["notification.browser"],
					onChange: () => setSettings("notification.browser", (v) => !v),
				},
			],
		},
		{
			label: "Appearance",
			items: [
				{
					label: "Zoom",
					type: "slider",
					min: 12,
					max: 24,
					value: () => settings["app.textSize"],
					onChange: (v) => setSettings("app.textSize", v),
				},
			],
		},
		{
			label: "Discord",
			show: IS_DESKTOP || IS_DISCORD_EMBEDDED,
			items: [
				{
					label: "Enable Rich Presence",
					type: "switch",
					description: "Show what you are currently listening to on Discord",
					disabled: IS_DISCORD_EMBEDDED,
					value: () => settings["discord.richPresence"],
					onChange: () => setSettings("discord.richPresence", (v) => !v),
				},
				{
					type: "element",
					label: "",
					hide: !settings["discord.richPresence"],
					element: () => (
						<Button class="px-2 py-0.5" onClick={() => navigate("/settings/rich-presence")}>
							<Text.Body2>Customize</Text.Body2>
						</Button>
					),
				},
				{
					label: "Enable RPC Features",
					type: "switch",
					description: "Experimental!",
					hide: IS_DISCORD_EMBEDDED,
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
			label: "Spotify",
			show: SPOTIFY_INTEGRATION && !SPOTIFY_CLIENT_ID && !IS_DISCORD_EMBEDDED,
			items: [
				{
					label: "Enable Spotify Integration",
					description: () => (
						<Text.Caption1
							class="underline underline-offset-2 cursor-pointer"
							onClick={() => setIsSpotifyTutorialOpen(true)}
						>
							How to use?
						</Text.Caption1>
					),
					type: "switch",
					value: () => settings["spotify.enabled"],
					onChange: () => setSettings("spotify.enabled", (v) => !v),
				},
				{
					label: "Spotify Client ID",
					type: "text",
					hide: !settings["spotify.enabled"],
					value: () => settings["spotify.clientId"],
					onChange: (v) => setSettings("spotify.clientId", v),
				},
				{
					type: "element",
					label: "",
					hide: !settings["spotify.enabled"],
					element: () => (
						<Button
							class="px-2 py-0.5"
							onClick={spotify.initialize}
							disabled={!settings["spotify.clientId"]}
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
					onInput: (v) => setSettings("app.snowfall.speed", v),
				},
				{
					label: "Snowfall Amount",
					type: "slider",
					min: 1,
					max: 100,
					value: () => settings["app.snowfall.amount"],
					onInput: (v) => setSettings("app.snowfall.amount", v),
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
								<Text.H4 class="uppercase font-medium text-neutral-400">{c.label}</Text.H4>
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

							<Divider dark />
						</Show>
					)}
				</For>

				<div class="flex flex-row justify-between">
					<Show when={!IS_DISCORD_EMBEDDED}>
						<Button
							rounded
							class="max-w-max text-red-500 !border-red-500 hover:bg-red-500/10 px-8 py-1.5"
							onClick={onClickLogout}
						>
							Logout
						</Button>
					</Show>

					<div class="flex flex-col text-right w-full">
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

			<SpotifyIntegrationTutorialModal
				isOpen={isSpotifyTutorialOpen()}
				onClose={() => setIsSpotifyTutorialOpen(false)}
			/>
		</Container>
	);
};
