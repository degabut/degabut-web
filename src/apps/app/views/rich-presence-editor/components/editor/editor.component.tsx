import { Button, Divider, Text } from "@common";
import { RichPresenceUtil ,type  IRichPresenceAsset,type  IRichPresencePlaceholder,type  IRichPresenceTemplate  } from "@discord";
import { For, Show, createMemo, createSignal, type Component } from "solid-js";
import { AssetsTable, InputText, PlaceholdersTable, RichPresencePreview } from "./components";

type EditorProps = {
	initialRichPresence: IRichPresenceTemplate;
	defaultRichPresenceTemplate: IRichPresenceTemplate;
	assets: IRichPresenceAsset[];
	placeholder: IRichPresencePlaceholder;
	placeholderDescription: IRichPresencePlaceholder;
	onSave: (richPresence: IRichPresenceTemplate) => void;
};

export const Editor: Component<EditorProps> = (props) => {
	const [current, setCurrent] = createSignal(props.initialRichPresence);

	const hasChanged = createMemo(
		() =>
			JSON.stringify(props.initialRichPresence, Object.keys(props.initialRichPresence).sort()) !==
			JSON.stringify(current(), Object.keys(current()).sort())
	);

	const placeHolderDescription = () => {
		const values = props.placeholder;
		const activeDescription: IRichPresencePlaceholder = {};
		for (const key of Object.keys(values) as Array<keyof IRichPresencePlaceholder>) {
			const description = props.placeholderDescription[key];
			if (description) activeDescription[key] = description;
		}
		return activeDescription;
	};

	const parsedRichPresence = createMemo(() =>
		RichPresenceUtil.parseTemplate(current(), props.placeholder, props.assets)
	);

	const setRichPresence = (key: keyof IRichPresenceTemplate, value: string) => {
		setCurrent((prev) => ({ ...prev, [key]: value }));
	};

	const cancel = () => {
		setCurrent({ ...props.initialRichPresence });
	};

	const reset = () => {
		setCurrent({ ...props.defaultRichPresenceTemplate });
	};

	const inputs = [
		{ label: "Details", key: "details" },
		{ label: "State", key: "state" },
		{ label: "Small Image URL / Asset Key", key: "smallImageKey" },
		{ label: "Small Image Text", key: "smallImageText" },
		{ label: "Large Image URL / Asset Key", key: "largeImageKey" },
		{ label: "Large Image Text", key: "largeImageText" },
	] as const;

	return (
		<div class="space-y-8">
			<div class="grid md:grid-cols-2 gap-x-8 gap-y-6">
				<For each={inputs}>
					{({ key, label }) => (
						<InputText label={label} value={current()[key]} onInput={(v) => setRichPresence(key, v)} />
					)}
				</For>
			</div>

			<div class="grid md:grid-cols-2 gap-x-8 gap-y-8">
				<div class="space-y-4">
					<PlaceholdersTable placeholders={placeHolderDescription()} />
					<AssetsTable assets={props.assets} />
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
						<Button disabled={!hasChanged()} class="px-4 py-1" onClick={() => props.onSave(current())}>
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
	);
};
