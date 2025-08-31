import { useApp } from "@app/providers";
import { AppRoutes } from "@app/routes";
import { Button, Container, Divider, KeyboardHint, Text, TimeUtil, useNavigate } from "@common";
import {
	APP_VERSION,
	DESKTOP_APP_VERSION,
	IS_DESKTOP,
	IS_DISCORD_EMBEDDED,
	SPOTIFY_CLIENT_ID,
	SPOTIFY_INTEGRATION,
} from "@constants";
import { useDesktop } from "@desktop";
import { LoginRoutes } from "@login/routes";
import { useSettings } from "@settings";
import { useSpotify } from "@spotify";
import { For, Show, createSignal, onMount, type Accessor, type Component, type JSX, type JSXElement } from "solid-js";
import {
	Item,
	KeybindItem,
	OptionsItem,
	SliderItem,
	SpotifyIntegrationTutorialModal,
	SwitchItem,
	TextItem,
	type OptionsItemProps,
	type SliderItemProps,
} from "./components";

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
	| SettingsItemParams<"slider", number, SliderItemProps>
	| SettingsItemParams<"options", string, OptionsItemProps>
	| { type: "element"; element: Accessor<JSX.Element> }
);

export const Settings: Component = () => {
	const app = useApp()!;
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
			onConfirm: () => navigate(LoginRoutes.Login),
		});
	};

	const categories: Accessor<SettingsCategory[]> = () => [
		{
			label: "Preferences",
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
				{
					label: "Enable Media Session",
					type: "switch",
					description: "Control playback using media keys",
					value: () => settings["app.mediaSession.enabled"],
					onChange: (v) => setSettings("app.mediaSession.enabled", v),
				},
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
						<Button class="px-2 py-0.5" onClick={() => navigate(AppRoutes.RichPresence)}>
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
								desktop?.ipc.send?.("authenticate-rpc", {
									clientId: settings["discord.rpcClientId"],
									clientSecret: settings["discord.rpcClientSecret"],
								})
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
			show: SPOTIFY_INTEGRATION && !SPOTIFY_CLIENT_ID,
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
							onClick={() => {
								if (IS_DISCORD_EMBEDDED) {
									spotify.initiateManualAuthentication();
								} else {
									spotify.initialize();
									spotify.authenticate();
								}
							}}
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
				{
					label: "Enable Now Playing Overlay",
					description: "Show an overlay with the currently playing song on your screen",
					type: "switch",
					value: () => settings["overlay.nowPlaying.enabled"],
					onChange: (v) => setSettings("overlay.nowPlaying.enabled", v),
				},
				{
					label: "Now Playing Overlay Opacity",
					type: "slider",
					min: 0,
					max: 100,
					step: 5,
					value: () => settings["overlay.nowPlaying.opacity"],
					onInput: (v) => setSettings("overlay.nowPlaying.opacity", v),
				},
				{
					label: "Now Playing Overlay Position",
					type: "options",
					options: [
						{ value: "tl", label: "Top Left" },
						{ value: "tr", label: "Top Right" },
						{ value: "bl", label: "Bottom Left" },
						{ value: "br", label: "Bottom Right" },
					],
					value: () => settings["overlay.nowPlaying.position"],
					onChange: (v) => setSettings("overlay.nowPlaying.position", v as "tl" | "tr" | "bl" | "br"),
				},
				{
					label: "Now Playing Overlay Size",
					type: "options",
					options: [
						{ value: "sm", label: "Small" },
						{ value: "md", label: "Normal" },
						{ value: "lg", label: "Large" },
					],
					value: () => settings["overlay.nowPlaying.size"],
					onChange: (v) => setSettings("overlay.nowPlaying.size", v as "md" | "lg"),
				},
			],
		},
		{
			label: "Jam",
			items: [
				{
					label: "Enable Jamming Cat",
					description: () => (
						<div class="flex-row-center space-x-2">
							<Text.Caption1>Show jamming cat by pressing</Text.Caption1>
							<KeyboardHint small key="J" />
						</div>
					),
					type: "switch",
					value: () => settings["app.catJam.enabled"],
					onChange: () => setSettings("app.catJam.enabled", (v) => !v),
				},
				{
					label: "Enable Overlay Jamming Cat",
					description: "Show jamming cat on your screen",
					hide: !IS_DESKTOP,
					type: "switch",
					value: () => settings["overlay.catJam.enabled"],
					onChange: (v) => setSettings("overlay.catJam.enabled", v),
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
		<Container size="md" centered>
			<div class="flex flex-col space-y-12">
				<For each={categories()}>
					{(c) => (
						<Show when={"show" in c ? c.show : true}>
							<div class="space-y-4 md:space-y-6">
								<Text.H4 class="uppercase font-medium text-neutral-400">{c.label}</Text.H4>
								<For each={c.items.filter((i) => !i.hide)}>
									{(i) => (
										<>
											{i.type === "keybind" && <KeybindItem {...i} />}
											{i.type === "switch" && <SwitchItem {...i} />}
											{(i.type === "text" || i.type === "password") && <TextItem {...i} />}
											{i.type === "slider" && <SliderItem {...i} />}
											{i.type === "options" && <OptionsItem {...i} />}
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
							class="max-w-max text-red-500 !outline-red-500 hover:bg-red-500/10 px-8 py-1.5"
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
