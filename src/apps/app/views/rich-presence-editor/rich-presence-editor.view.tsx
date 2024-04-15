import { AppRoutes } from "@app/routes";
import { Container, Tabs, Text, TimeUtil, UrlUtil } from "@common";
import { IS_DESKTOP, IS_DISCORD_EMBEDDED, bots } from "@constants";
import { defaultRichPresenceIdleTemplate, defaultRichPresenceTemplate, type IRichPresencePlaceholder } from "@discord";
import { useSettings } from "@settings";
import { Navigate } from "@solidjs/router";
import type { Component } from "solid-js";
import { Editor } from "./components";
import { useAssets } from "./hooks";

export const RichPresenceEditor: Component = () => {
	// eslint-disable-next-line solid/components-return-once
	if (!IS_DESKTOP && !IS_DISCORD_EMBEDDED) return <Navigate href={AppRoutes.Queue} />;

	const assets = useAssets();
	const { settings, setSettings } = useSettings();

	const placeholderDescription: IRichPresencePlaceholder = {
		title: "Track title",
		creator: "Track creator (channel name or artists)",
		imageUrl: "Track image URL (thumbnail or album cover)",
		duration: "Track duration (in hh:mm:ss format)",
		botIconUrl: "Bot icon URL",
		botName: "Bot name",
	};

	const placeholder: IRichPresencePlaceholder = {
		title: "Track Title",
		creator: "Various Artists",
		imageUrl: "/img/placeholders/100x100.jpg",
		duration: TimeUtil.secondsToTime(260),
		listenerKey: "single_user",
		listenerText: "Listening alone",
		botIconUrl: UrlUtil.toAbsolute(bots[0].iconUrl),
		botName: bots[0].name,
	};

	const idlePlaceholder: IRichPresencePlaceholder = {
		botIconUrl: UrlUtil.toAbsolute(bots[0].iconUrl),
		botName: bots[0].name,
	};

	return (
		<Container size="lg" extraClass="space-y-6" centered>
			<Text.H1>Rich Presence Editor</Text.H1>

			<Tabs
				extraTabClass="md:max-w-max"
				extraContentContainerClass="pt-4"
				items={[
					{
						id: "template",
						labelText: "Listening",
						element: () => (
							<Editor
								assets={assets()}
								defaultRichPresenceTemplate={defaultRichPresenceTemplate}
								initialRichPresence={settings["discord.richPresence.template"]}
								onSave={(rp) => setSettings("discord.richPresence.template", rp)}
								placeholder={placeholder}
								placeholderDescription={placeholderDescription}
							/>
						),
					},
					{
						id: "idleTemplate",
						labelText: "Idling",
						element: () => (
							<Editor
								assets={assets()}
								defaultRichPresenceTemplate={defaultRichPresenceIdleTemplate}
								initialRichPresence={settings["discord.richPresence.idleTemplate"]}
								onSave={(rp) => setSettings("discord.richPresence.idleTemplate", rp)}
								placeholder={idlePlaceholder}
								placeholderDescription={placeholderDescription}
							/>
						),
					},
				]}
			/>
		</Container>
	);
};
