import { AppRoutes } from "@app/routes";
import { A, Icon, Text, contextMenu } from "@common";
import { bots } from "@constants";
import { useQueue } from "@queue";
import { Show, type Component } from "solid-js";

contextMenu;

type Props = {
	minimized: boolean;
};

export const BotSelector: Component<Props> = (props) => {
	const queue = useQueue()!;

	return (
		<div
			use:contextMenu={
				bots.length > 1
					? {
							openWithClick: true,
							header: <Text.H3 class="text-center">Choose Bot</Text.H3>,
							items: bots.map((b, i) => ({
								label: b.name || "Degabut",
								iconUrl: b.iconUrl,
								onClick: () => queue.setBot(i),
							})),
					  }
					: undefined
			}
		>
			<A
				href={AppRoutes.Queue}
				class="flex-row-center space-x-2.5 py-2 m-2"
				classList={{
					"hover:bg-white/[7.5%] rounded": !!bots,
					"justify-center": props.minimized,
					"px-2.5 justify-between": !props.minimized,
				}}
			>
				<img class="hover:animate-pulse w-8 h-auto" src={queue.bot().iconUrl} />
				<Show when={!props.minimized}>
					<Text.H3 truncate class="w-full">
						{queue.bot().name}
					</Text.H3>
					<Show when={bots.length > 1}>
						<div class="grow flex justify-end pl-4">
							<Icon name="swap" class="text-neutral-600" size="lg" />
						</div>
					</Show>
				</Show>
			</A>
		</div>
	);
};
