import { Text } from "@common/components";
import { IRichPresenceTemplate } from "@desktop/hooks";
import { Component, Show } from "solid-js";

type RichPresencePreviewProps = IRichPresenceTemplate;

export const RichPresencePreview: Component<RichPresencePreviewProps> = (props) => {
	return (
		<div class="rounded flex-row-center max-w-xs space-x-4 border border-neutral-700 p-4">
			<div class="relative shrink-0">
				<img src={props.largeImageKey} class="w-16 h-16 rounded-lg" title={props.largeImageText} />

				<Show when={props.smallImageKey} keyed>
					{(key) => (
						<img
							src={key}
							class="w-7 h-7 absolute rounded-full -bottom-1 -right-2"
							title={props.smallImageText}
						/>
					)}
				</Show>
			</div>
			<div class="-space-y-0.5 truncate">
				<Text.H4>Degabut</Text.H4>
				<div class="truncate" title={props.details}>
					<Text.Body2>{props.details}</Text.Body2>
				</div>
				<div class="truncate" title={props.state}>
					<Text.Body2>{props.state}</Text.Body2>
				</div>
			</div>
		</div>
	);
};
