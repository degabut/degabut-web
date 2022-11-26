import { ContextMenuItem } from "@components/ContextMenu";
import { Icon, Icons } from "@components/Icon";
import { RouterLink } from "@components/Link";
import { getVideoContextMenu } from "@components/Video";
import { Videos } from "@components/Videos";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useNavigate } from "solid-app-router";
import { Component, Show } from "solid-js";

type Props = {
	icon: Icons;
	href: string;
	label: string;
};

const HintItem: Component<Props> = (props) => {
	return (
		<RouterLink
			href={props.href}
			class="flex flex-row items-center w-full space-x-3 p-1.5 hover:bg-white/5 rounded"
		>
			<div class="!w-12 !h-12 flex-shrink-0 flex items-center justify-center rounded border border-neutral-500">
				<Icon name={props.icon} size="lg" extraClass="fill-neutral-500" />
			</div>
			<div class="text-neutral-400">{props.label}</div>
		</RouterLink>
	);
};

export const QueueTrackList: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	const tracks = () => queue.data()?.tracks || [];

	return (
		<div class="space-y-1.5">
			<Show when={tracks().length} keyed>
				<div classList={{ "opacity-50 pointer-events-none": queue.isTrackFreezed() }}>
					<Videos.SortableList
						data={tracks()}
						onSort={({ to }, data) => queue.changeTrackOrder(data.id, to)}
						sortableProps={(t) => {
							const isActive = queue.data()?.nowPlaying?.id === t.id;
							return {
								id: t.id,
								videoProps: {
									video: t.video,
									requestedBy: t.requestedBy,
									extraTitleClass: isActive ? "text-brand-600" : undefined,
									contextMenu: getVideoContextMenu({
										video: t.video,
										appStore: app,
										queueStore: queue,
										navigate,
										modifyContextMenuItems: (c) => {
											const contextMenu = [
												{
													element: () => (
														<ContextMenuItem icon="trashBin" label="Remove from Queue" />
													),
													onClick: () => queue.removeTrack(t),
												},
											];

											if (!isActive) {
												contextMenu.unshift({
													element: () => <ContextMenuItem icon="play" label="Play" />,
													onClick: () => queue.playTrack(t),
												});
											}

											c[0] = contextMenu;
											return c;
										},
									}),
								},
							};
						}}
					/>
				</div>
			</Show>

			<div
				class="space-y-2"
				classList={{
					"ml-[1.35rem]": !!tracks().length,
				}}
			>
				<HintItem label="Search for a song" icon="search" href="/app/search" />
				<HintItem label="Look at recommendations" icon="heartLine" href="/app/recommendation" />
			</div>
		</div>
	);
};
