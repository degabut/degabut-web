import { useQueue } from "@app/hooks";
import { Icon, RouterLink, Text } from "@common/components";
import { contextMenu } from "@common/directives";
import { bots } from "@constants";
import { Component, Show } from "solid-js";

contextMenu;

type Props = {
	minimized: boolean;
};

export const BotSelector: Component<Props> = (props) => {
	const queue = useQueue();

	return (
		<div
			use:contextMenu={
				bots
					? {
							openWithClick: true,
							header: <Text.H3 class="text-center pt-4">Choose Bot</Text.H3>,
							items: bots.map((b, i) => ({
								label: b.name || "Degabut",
								iconUrl: b.iconUrl,
								onClick: () => queue.setBot(i),
							})),
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
					src={queue.bot().iconUrl || "/android-chrome-192x192.png"}
				/>
				<Show when={bots && !props.minimized}>
					<Text.H3 truncate>{queue.bot().name}</Text.H3>
					<div class="grow flex justify-end pl-4">
						<Icon name="swap" class="fill-neutral-600" size="md" />
					</div>
				</Show>
			</RouterLink>
		</div>
	);
};