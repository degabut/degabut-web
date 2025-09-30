import { useAuth } from "@auth";
import { Spinner, useApi } from "@common";
import { DISCORD_ACTIVITY_APPLICATION_ID, DISCORD_ACTIVITY_URL_MAPPINGS, IS_DISCORD_EMBEDDED } from "@constants";
import { RPCCloseCodes, type DiscordSDK } from "@discord/embedded-app-sdk";
import { type IVoiceChannelMin } from "@queue";
import { useSettings } from "@settings";
import { useSpotify } from "@spotify";
import {
	Show,
	createContext,
	createEffect,
	createSignal,
	onMount,
	useContext,
	type Accessor,
	type ParentComponent,
} from "solid-js";
import { type IRichPresence } from "../../hooks";
import { PatchUrlUtil } from "../../utils";

type DiscordContextStore = {
	authorizeAndAuthenticate: () => Promise<void>;
	setActivity: (activity: IRichPresence | null) => void;
	isReady: Accessor<boolean>;
	isPip: Accessor<boolean>;
	currentChannel: Accessor<IVoiceChannelMin | null>;
	reload: () => void;
};

export const DiscordContext = createContext<DiscordContextStore>();

export const DiscordProvider: ParentComponent = (props) => {
	// eslint-disable-next-line solid/components-return-once
	if (!IS_DISCORD_EMBEDDED) return <>{props.children}</>;

	const api = useApi();
	const auth = useAuth();
	const spotify = useSpotify();
	let discordSdk: DiscordSDK;
	const [isReady, setIsReady] = createSignal(false);
	const [isPip, setIsPip] = createSignal(false);
	const [currentChannel, setCurrentChannel] = createSignal<IVoiceChannelMin | null>(null);
	const { settings } = useSettings()!;

	onMount(async () => {
		// dynamic import
		import("./font.css");
		const { DiscordSDK, patchUrlMappings } = await import("@discord/embedded-app-sdk");

		if (DISCORD_ACTIVITY_URL_MAPPINGS.length) {
			patchUrlMappings(DISCORD_ACTIVITY_URL_MAPPINGS);
			spotify.client.httpClient.interceptors.response.use((r) =>
				PatchUrlUtil.intercept(r, DISCORD_ACTIVITY_URL_MAPPINGS)
			);
			if (spotify.client.httpClient.defaults.baseURL) {
				spotify.client.httpClient.defaults.baseURL = PatchUrlUtil.rewriteString(
					spotify.client.httpClient.defaults.baseURL,
					DISCORD_ACTIVITY_URL_MAPPINGS
				);
			}
			api.client.interceptors.response.use((r) => PatchUrlUtil.intercept(r, DISCORD_ACTIVITY_URL_MAPPINGS));
			api.youtubeClient.interceptors.response.use((r) =>
				PatchUrlUtil.intercept(r, DISCORD_ACTIVITY_URL_MAPPINGS)
			);
			PatchUrlUtil.patchWebSocket(DISCORD_ACTIVITY_URL_MAPPINGS);
		}

		discordSdk = new DiscordSDK(DISCORD_ACTIVITY_APPLICATION_ID, { disableConsoleLogOverride: true });
		await discordSdk.ready();
		await authorizeAndAuthenticate();

		// capture open new tab
		window.open = (function (open) {
			return function (url, target, features) {
				// set name if missing here
				if (url && target === "_blank") {
					discordSdk.commands.openExternalLink({
						url: url.toString(),
					});
					return null;
				} else {
					return open.call(window, url, target, features);
				}
			};
		})(window.open);
	});

	createEffect(() => {
		if (isReady()) {
			discordSdk.commands.setConfig({
				use_interactive_pip: settings["discord.interactivePip.enabled"],
			});
		}
	});

	const authorizeAndAuthenticate = async () => {
		setIsReady(false);
		const { code } = await discordSdk.commands.authorize({
			client_id: DISCORD_ACTIVITY_APPLICATION_ID,
			response_type: "code",
			prompt: "none",
			scope: ["identify", "rpc.activities.write", "guilds"],
		});

		const { token, discordAccessToken } = await auth.getAccessToken(code);
		api.authManager.setAccessToken(token);
		await discordSdk.commands.authenticate({ access_token: discordAccessToken });

		onAuthenticated();
		setIsReady(true);
	};

	const onAuthenticated = async () => {
		discordSdk.subscribe("ACTIVITY_LAYOUT_MODE_UPDATE", ({ layout_mode }) => setIsPip(layout_mode === 1));

		if (discordSdk.channelId) {
			const channel = await discordSdk.commands.getChannel({ channel_id: discordSdk.channelId });
			setCurrentChannel({
				id: channel.id,
				name: channel.name || "",
			});
		}
	};

	const reload = async () => {
		discordSdk.close(RPCCloseCodes.CLOSE_NORMAL, "Please reopen the application.");
	};

	const setActivity = (activity: IRichPresence | null) => {
		if (!activity) return;

		discordSdk.commands.setActivity({
			activity: {
				details: activity.details,
				state: activity.state,
				assets: {
					large_image: activity.largeImageKey,
					large_text: activity.largeImageText,
					small_image: activity.smallImageKey,
					small_text: activity.smallImageText,
				},
				timestamps: activity.startTimestamp ? { start: activity.startTimestamp } : undefined,
			},
		});
	};

	return (
		<DiscordContext.Provider
			value={{
				authorizeAndAuthenticate,
				setActivity,
				isReady,
				isPip,
				currentChannel,
				reload,
			}}
		>
			<Show
				when={isReady()}
				fallback={
					<div class="bg-neutral-850 h-full flex-row-center justify-center">
						<Spinner size="3xl" />
					</div>
				}
			>
				{props.children}
			</Show>
		</DiscordContext.Provider>
	);
};

export const useDiscord = () => useContext(DiscordContext);
