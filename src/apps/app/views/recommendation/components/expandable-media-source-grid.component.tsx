import { useApp } from "@app/providers";
import { useApi, type IContextMenuItem } from "@common";
import { MediaSources, type IMediaSource, type MediaSourceCardProps } from "@media-source";
import { useQueue } from "@queue";
import { UserApi, UserConfirmationUtil } from "@user";
import type { Component } from "solid-js";
import { ShowMoreTitle } from "./title.component";

type Props = {
	onClickMore: () => void;
	mediaSources: IMediaSource[];
	label: string;
	isLoading: boolean;
	removable?: boolean;
	onRemove?: (media: IMediaSource) => void;
};

export const ExpandableMediaSourceGrid: Component<Props> = (props) => {
	const app = useApp()!;
	const api = useApi();
	const userApi = new UserApi(api.client);
	const queue = useQueue()!;

	const mediaSourceProps = (mediaSource: IMediaSource): MediaSourceCardProps => {
		const inQueue = queue.data.tracks?.some((t) => t.mediaSource.id === mediaSource.id);
		const contextMenu = {
			modify: (items: IContextMenuItem[][]) => {
				if (props.removable) {
					items[items.length - 2].push({
						label: "Remove From History",
						icon: "closeLine",
						onClick: () => {
							app.setConfirmation({
								...UserConfirmationUtil.removePlayHistoryConfirmation(mediaSource),
								onConfirm: async () => {
									await userApi.removePlayHistory(mediaSource.id);
									props.onRemove?.(mediaSource);
								},
							});
						},
					});
				}
				return items;
			},
		};

		return {
			mediaSource,
			inQueue,
			contextMenu,
		};
	};

	return (
		<MediaSources.Grid
			title={() => <ShowMoreTitle {...props} />}
			data={props.mediaSources}
			isLoading={props.isLoading}
			mediaSourceProps={mediaSourceProps}
			skeletonCount={7}
		/>
	);
};
