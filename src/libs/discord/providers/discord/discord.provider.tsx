import { useAuth } from "@auth/hooks";
import { Spinner } from "@common/components";
import { useApi, useScreen } from "@common/hooks";
import { DISCORD_ACTIVITY_URL_MAPPINGS, IS_DISCORD_EMBEDDED, bots } from "@constants";
import type { DiscordSDK } from "@discord/embedded-app-sdk";
import { IRichPresence } from "@discord/hooks";
import { useBeforeLeave, useNavigate } from "@solidjs/router";
import axios from "axios";
import { Accessor, ParentComponent, Show, createContext, createMemo, createSignal, onMount } from "solid-js";
import { PatchUrlUtil } from "../../utils";

export type DiscordContextStore = {
	authorizeAndAuthenticate: () => Promise<void>;
	setActivity: (activity: IRichPresence | null) => void;
	isReady: Accessor<boolean>;
	isMinimized: Accessor<boolean>;
};

export const DiscordContext = createContext<DiscordContextStore | undefined>();

export const DiscordProvider: ParentComponent = (props) => {
	// eslint-disable-next-line solid/components-return-once
	if (!IS_DISCORD_EMBEDDED) return <>{props.children}</>;

	const api = useApi();
	const auth = useAuth();
	const screen = useScreen();
	const navigate = useNavigate();
	let discordSdk: DiscordSDK;
	const [isReady, setIsReady] = createSignal(false);

	onMount(async () => {
		// dynamic import
		import("./font.css");
		const { DiscordSDK, patchUrlMappings } = await import("@discord/embedded-app-sdk");

		if (DISCORD_ACTIVITY_URL_MAPPINGS.length) {
			patchUrlMappings(DISCORD_ACTIVITY_URL_MAPPINGS);
			axios.interceptors.response.use((r) => PatchUrlUtil.intercept(r, DISCORD_ACTIVITY_URL_MAPPINGS));
			api.client.interceptors.response.use((r) => PatchUrlUtil.intercept(r, DISCORD_ACTIVITY_URL_MAPPINGS));
			api.youtubeClient.interceptors.response.use((r) =>
				PatchUrlUtil.intercept(r, DISCORD_ACTIVITY_URL_MAPPINGS)
			);
			PatchUrlUtil.patchWebSocket(DISCORD_ACTIVITY_URL_MAPPINGS);
		}

		discordSdk = new DiscordSDK(bots[0].id, { disableConsoleLogOverride: true });
		await discordSdk.ready();
		await authorizeAndAuthenticate();
	});

	useBeforeLeave((e) => {
		const toParams = new URLSearchParams(e.to.toString().split("?")[1]);
		if (toParams.get("frame_id")) return;
		e.preventDefault();

		const params = new URLSearchParams(location.search);
		const newParams = new URLSearchParams({
			instance_id: params.get("instance_id") || "",
			channel_id: params.get("channel_id") || "",
			guild_id: params.get("guild_id") || "",
			frame_id: params.get("frame_id") || "",
			platform: params.get("platform") || "",
		});

		const delimiter = e.to.toString().includes("?") ? "&" : "?";
		const target = e.to.toString() + delimiter + newParams.toString();
		navigate(target);
	});

	// TODO verify this
	const isMinimized = createMemo(() => screen.size <= 320);

	const authorizeAndAuthenticate = async () => {
		setIsReady(false);
		const { code } = await discordSdk.commands.authorize({
			client_id: bots[0].id,
			response_type: "code",
			prompt: "none",
			scope: ["identify", "rpc.activities.write"],
		});

		const { token, discordAccessToken } = await auth.getAccessToken(code);
		api.authManager.setAccessToken(token);
		await discordSdk.commands.authenticate({ access_token: discordAccessToken });

		setIsReady(true);
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
				isMinimized,
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
