import { AbbreviationIcon, ContextMenuButton, Text, type ContextMenuDirectiveParams } from "@common";
import { Show, type Component, type JSX } from "solid-js";

type Props = {
	title: string;
	description?: () => JSX.Element;
	image?: string | (() => JSX.Element);
	contextMenu?: ContextMenuDirectiveParams;
};

export const MainItem: Component<Props> = (props) => {
	return (
		<div class="flex-row-center space-x-4">
			<Show when={props.image} keyed fallback={<AbbreviationIcon text={props.title} size="xl" />}>
				{(image) =>
					typeof image === "string" ? (
						<img class="rounded w-24 md:w-32 aspect-square object-cover" src={image} />
					) : (
						image()
					)
				}
			</Show>

			<div class="space-y-4 flex-grow truncate">
				<div class="flex-row-center justify-between truncate md:justify-start md:space-x-8">
					<Text.H1 truncate title={props.title}>
						{props.title}
					</Text.H1>
				</div>
				<Show when={props.description} keyed>
					{(d) => <div class="flex md:flex-row space-x-8">{d()} </div>}
				</Show>
			</div>

			<Show when={props.contextMenu} keyed>
				{(contextMenu) => <ContextMenuButton contextMenu={contextMenu} />}
			</Show>
		</div>
	);
};
