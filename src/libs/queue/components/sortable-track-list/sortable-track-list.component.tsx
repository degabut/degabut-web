import { Icon, Item, SortableList, useScreen } from "@common";
import { MediaSource, type MediaSourceListProps } from "@media-source";
import { For, Show } from "solid-js";
import { type ITrack } from "../../apis";

type SortEvent = {
	from: number;
	to: number;
};

type SortableTrackListProps = {
	tracks: ITrack[];
	mediaSourceProps: (track: ITrack) => MediaSourceListProps;
	dense?: boolean;
	isLoading?: boolean;
	showWhenLoading?: boolean;
	onSort?: (event: SortEvent, track: ITrack) => void;
};

const mediaListClassProps = {
	extraContainerClass: "cursor-ns-resize",
	extraImageClass: "pointer-events-none",
	extraContextMenuButtonClass: "hidden md:block",
};

export function SortableTrackList(props: SortableTrackListProps) {
	const screen = useScreen();

	return (
		<div
			class="h-full"
			classList={{
				"space-y-2": !props.dense,
				"space-y-0.5": props.dense,
			}}
		>
			<Show when={props.showWhenLoading || !props.isLoading}>
				<SortableList<ITrack>
					data={props.tracks}
					id={(m) => m.id}
					customDragActivator={!screen.gte.md}
					onSort={(e, { data }) => props.onSort?.(e, data)}
				>
					{(track, sortable) => (
						<MediaSource.List
							{...mediaListClassProps}
							right={() => (
								<Show when={!screen.gte.md}>
									<div
										{...sortable?.dragActivators}
										class="visible px-2 py-3 text-neutral-400 hover:text-neutral-100 touch-none"
										onClick={(e) => e.stopPropagation()}
									>
										<Icon name="reorder" size="md" />
									</div>
								</Show>
							)}
							{...props.mediaSourceProps(track)}
						/>
					)}
				</SortableList>
			</Show>

			<Show when={props.isLoading}>
				<For each={Array(5)}>{() => <Item.ListSkeleton />}</For>
			</Show>
		</div>
	);
}
