import { Button, Container, Divider, Tabs, Text } from "@common/components";
import { TimeUtil } from "@common/utils";
import { IS_DESKTOP } from "@constants";
import { IRichPresencePlaceholder, defaultRichPresenceTemplate } from "@desktop/hooks";
import { RichPresenceUtil } from "@desktop/utils/rich-presence.util";
import { useSettings } from "@settings/hooks";
import { Navigate } from "@solidjs/router";
import { Component, For, Show, createEffect, createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { InputText, RichPresencePreview } from "./components";
import { useAssets } from "./hooks";

type SettingsKey = "discord.richPresence.template" | "discord.richPresence.idleTemplate";

export const RichPresenceEditor: Component = () => {
	// eslint-disable-next-line solid/components-return-once
	if (!IS_DESKTOP) return <Navigate href="/queue" />;

	const assets = useAssets();
	const { settings, setSettings } = useSettings();
	const [currentSettings, setCurrentSettings] = createSignal<SettingsKey>("discord.richPresence.template");
	const [richPresence, setRichPresence] = createStore({ ...settings["discord.richPresence.template"] });

	const hasChanged = createMemo(
		() =>
			JSON.stringify(richPresence, Object.keys(richPresence).sort()) !==
			JSON.stringify(settings[currentSettings()], Object.keys(richPresence).sort())
	);

	createEffect(() => {
		const newSettings = settings[currentSettings()];
		setRichPresence({ ...newSettings });
	});

	const placeholderDescription: Partial<IRichPresencePlaceholder> = {
		title: "Track title",
		creator: "Track creator (channel name or artists)",
		imageUrl: "Track image URL (thumbnail or album cover)",
		duration: "Track duration (in hh:mm:ss format)",
	};

	const placeholder = {
		title: "Track Title",
		creator: "Various Artists",
		imageUrl: "https://picsum.photos/seed/picsum/100/100",
		duration: TimeUtil.secondsToTime(260),
		listenerKey: "single_user",
		listenerText: "Listening alone",
	};

	const inputs = [
		{ label: "Details", key: "details" },
		{ label: "State", key: "state" },
		{ label: "Small Image URL / Asset Key", key: "smallImageKey" },
		{ label: "Small Image Text", key: "smallImageText" },
		{ label: "Large Image URL / Asset Key", key: "largeImageKey" },
		{ label: "Large Image Text", key: "largeImageText" },
	] as const;

	const parsedRichPresence = createMemo(() =>
		RichPresenceUtil.parseTemplate(
			richPresence,
			currentSettings() === "discord.richPresence.template" ? placeholder : {},
			assets()
		)
	);

	const save = () => {
		setSettings(currentSettings(), richPresence);
	};

	const cancel = () => {
		setRichPresence({ ...settings[currentSettings()] });
	};

	const reset = () => {
		setRichPresence({ ...defaultRichPresenceTemplate });
	};

	return (
		<Container size="lg" class="space-y-6" centered>
			<Text.H1>Rich Presence Editor</Text.H1>

			<Tabs
				extraTabClass="md:max-w-max"
				onChange={(t) => setCurrentSettings(t.id as SettingsKey)}
				items={[
					{
						id: "discord.richPresence.template",
						labelText: "Listening",
					},
					{
						id: "discord.richPresence.idleTemplate",
						labelText: "Idling",
					},
				]}
			/>

			<div class="space-y-8">
				<div class="grid md:grid-cols-2 gap-x-8 gap-y-6">
					<For each={inputs}>
						{({ key, label }) => (
							<InputText
								label={label}
								value={richPresence[key]}
								onInput={(v) => setRichPresence(key, v)}
							/>
						)}
					</For>
				</div>

				<div class="grid md:grid-cols-2 gap-x-8 gap-y-8">
					<div class="space-y-4">
						<Show when={currentSettings() === "discord.richPresence.template"}>
							<div class="space-y-2">
								<Text.H3>Placeholders</Text.H3>

								<table>
									<tbody class="align-top">
										<For each={Object.entries(placeholderDescription)}>
											{([key, description]) => (
												<tr>
													<td class="pr-4">
														<code>&#123;{key}&#125;</code>
													</td>
													<td>{description}</td>
												</tr>
											)}
										</For>
									</tbody>
								</table>
							</div>
						</Show>

						<div class="space-y-2 max-w-max">
							<Text.H3>Asset Keys</Text.H3>

							<div class="grid grid-cols-2 gap-y-2 gap-x-8">
								<For each={assets()}>
									{(asset) => (
										<div class="flex flex-row items-center space-x-2">
											<img class="w-6 h-6 rounded-full" src={asset.url} />
											<Text.Body2>{asset.name}</Text.Body2>
										</div>
									)}
								</For>
							</div>
						</div>
					</div>

					<div class="space-y-2">
						<Text.H3>Preview</Text.H3>
						<RichPresencePreview {...parsedRichPresence()} />
					</div>
				</div>

				<Divider extraClass="my-4" />

				<div class="space-y-4">
					<Show when={hasChanged()}>
						<Text.Body1 class="text-brand-600 rounded">
							Changes detected, press the save button to apply.
						</Text.Body1>
					</Show>
					<div class="flex flex-row justify-between">
						<div class="flex flex-row space-x-4">
							<Button disabled={!hasChanged()} class="px-4 py-1" onClick={save}>
								Save
							</Button>

							<Show when={hasChanged()}>
								<Button class="px-4 py-1" onClick={cancel}>
									Cancel
								</Button>
							</Show>
						</div>
						<Button flat class="px-4 py-1" onClick={reset}>
							Reset
						</Button>
					</div>
				</div>
			</div>
		</Container>
	);
};
