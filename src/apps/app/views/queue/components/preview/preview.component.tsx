import { Button, Text } from "@common/components";
import { Component, Show } from "solid-js";
import { PreviewEmbed, PreviewThumbnail } from "./components";

type SelectorButtonProps = {
	text: string;
	isActive: boolean;
	onClick: () => void;
};

const SelectorButton: Component<SelectorButtonProps> = (props) => {
	return (
		<Button class="px-4 py-1" flat={!props.isActive} onClick={props.onClick}>
			<Text.Body2>{props.text}</Text.Body2>
		</Button>
	);
};

type Props = {
	isThumbnail: boolean;
	onChangeViewMode: (isThumbnail: boolean) => void;
};

export const Preview: Component<Props> = (props) => {
	return (
		<div class="flex flex-col">
			<div class="flex-row-center space-x-2">
				<SelectorButton
					text="Thumbnail"
					isActive={props.isThumbnail}
					onClick={() => props.onChangeViewMode(true)}
				/>
				<SelectorButton
					text="Video"
					isActive={!props.isThumbnail}
					onClick={() => props.onChangeViewMode(false)}
				/>
			</div>

			<div class="grow flex-row-center">
				<Show when={!props.isThumbnail} fallback={<PreviewThumbnail />}>
					<div class="px-2 lg:px-4 xl:px-6 2xl:px-8 3xl:px-12 w-full">
						<PreviewEmbed />
					</div>
				</Show>
			</div>
		</div>
	);
};
