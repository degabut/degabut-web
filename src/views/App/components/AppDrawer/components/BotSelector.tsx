import { RouterLink } from "@components/A";
import { Icon } from "@components/Icon";
import { Text } from "@components/Text";
import { bots } from "@constants";
import { contextMenu } from "@directives/contextMenu";
import { useBotSelector } from "@hooks/useBotSelector";
import { Component, Show } from "solid-js";

contextMenu;

type BotListItemProps = {
	name?: string;
	iconUrl?: string;
};

const BotListItem: Component<BotListItemProps> = (props) => {
	return (
		<div class="flex-row-center space-x-2 py-0.5">
			<img class="hover:animate-pulse w-6 h-auto" src={props.iconUrl} />
			<Text.Body1>{props.name || "Degabut"}</Text.Body1>
		</div>
	);
};

type Props = {
	minimized: boolean;
};

export const BotSelector: Component<Props> = (props) => {
	const botSelector = useBotSelector();

	return (
		<div
			use:contextMenu={
				bots
					? {
							openWithClick: true,
							header: <Text.H3 class="text-center pt-4">Choose Bot</Text.H3>,
							items: [
								bots.map((b, i) => ({
									element: () => <BotListItem name={b.name} iconUrl={b.iconUrl} />,
									onClick: () => botSelector.switchBot(i),
								})),
							],
					  }
					: undefined
			}
		>
			<RouterLink
				href="/app/queue"
				class="flex-row-center space-x-2.5 py-2 m-2"
				classList={{
					"hover:bg-white/[7.5%] rounded": !!bots,
					"justify-center": props.minimized,
					"px-2.5 justify-between": !props.minimized,
				}}
			>
				<img
					class="hover:animate-pulse w-8 h-auto"
					src={botSelector.currentBot().iconUrl || "/android-chrome-192x192.png"}
				/>
				<Show when={bots && !props.minimized}>
					<Text.H3 truncate>{botSelector.currentBot().name}</Text.H3>
					<div class="grow flex justify-end pl-4">
						<Icon name="swap" class="fill-neutral-600" size="md" />
					</div>
				</Show>
			</RouterLink>
		</div>
	);
};
