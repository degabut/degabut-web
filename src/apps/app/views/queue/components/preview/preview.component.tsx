import { Show, type Component } from "solid-js";
import { PreviewEmbed, PreviewThumbnail, SelectorButton } from "./components";

type Props = {
	isThumbnail: boolean;
	onChangeViewMode: (isThumbnail: boolean) => void;
};

export const Preview: Component<Props> = (props) => {
	return (
		<div class="flex flex-col h-full space-y-2 overflow-hidden">
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

			<Show
				when={!props.isThumbnail}
				fallback={
					<div class="w-full h-full p-4 overflow-hidden">
						<PreviewThumbnail />
					</div>
				}
			>
				<div class="flex-row-center px-2 lg:px-4 xl:px-6 2xl:px-8 3xl:px-12 h-full">
					<PreviewEmbed />
				</div>
			</Show>
		</div>
	);
};
