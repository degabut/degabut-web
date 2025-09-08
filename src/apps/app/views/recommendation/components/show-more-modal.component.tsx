import { useApp } from "@app/providers";
import { Divider, Modal, Text, useApi } from "@common";
import { MediaSources, type IMediaSource, type MediaSourceListProps } from "@media-source";
import { UserApi, UserConfirmationUtil, usePlayHistory } from "@user";
import dayjs from "dayjs";
import { createMemo, type Component } from "solid-js";

export enum ShowMoreType {
	MostPlayed = 1,
	RecentlyPlayed = 2,
	ChannelRelated = 3,
	MonthlyMostPlayed = 4,
}

type BaseProps = {
	isOpen: boolean;
	type: ShowMoreType | null;
	onClose: () => void;
	onAddToQueue?: (mediaSource: IMediaSource) => void;
	onAddToQueueAndPlay?: (mediaSource: IMediaSource) => void;
};

type UserProps = BaseProps & {
	initialUserId: string;
};

type MonthProps = BaseProps & {
	month: string;
};

export const ShowMoreModal: Component<UserProps | MonthProps> = (props) => {
	const app = useApp()!;
	const api = useApi();
	const userApi = new UserApi(api.client);

	const params = createMemo(() => {
		if ("initialUserId" in props) {
			switch (props.type) {
				case ShowMoreType.MostPlayed:
					return {
						userId: props.initialUserId,
						days: 30,
						count: 20,
					};

				case ShowMoreType.RecentlyPlayed:
					return {
						userId: props.initialUserId,
						last: 20,
					};

				case ShowMoreType.ChannelRelated:
					return {
						userId: props.initialUserId,
						voiceChannel: true,
						days: 14,
						count: 20,
					};
				default:
					return undefined;
			}
		} else if (props.month) {
			return {
				from: dayjs(props.month).startOf("month").toDate(),
				to: dayjs(props.month).endOf("month").toDate(),
				limit: 25,
			};
		}
	});

	const label = createMemo(() => {
		switch (props.type) {
			case ShowMoreType.MostPlayed:
				return "Most Played";

			case ShowMoreType.RecentlyPlayed:
				return "Recently Played";

			case ShowMoreType.ChannelRelated:
				return "Queue Recommendations";

			case ShowMoreType.MonthlyMostPlayed:
				return "month" in props ? `Most Played in ${dayjs(props.month).format("MMMM YYYY")}` : null;

			default:
				return null;
		}
	});

	const mediaSources = usePlayHistory(params);

	const mediaSourceProps = (mediaSource: IMediaSource): MediaSourceListProps => {
		const removable = props.type === ShowMoreType.RecentlyPlayed || props.type === ShowMoreType.MostPlayed;

		return {
			mediaSource,
			contextMenu: {
				modify: (items) => {
					if (removable) {
						items[items.length - 2].push({
							label: "Remove From History",
							icon: "closeLine",
							onClick: () => {
								app.setConfirmation({
									...UserConfirmationUtil.removePlayHistoryConfirmation(mediaSource),
									onConfirm: () =>
										userApi.removePlayHistory(mediaSource.id).then(mediaSources.refetch),
								});
							},
						});
					}
					return items;
				},
			},
		};
	};

	return (
		<Modal
			extraContainerClass="w-[42rem] h-[90vh] md:h-[70vh]"
			isOpen={props.isOpen}
			closeOnEscape
			handleClose={() => props.onClose()}
		>
			<div class="flex flex-col h-full">
				<div class="py-4 !pb-0">
					<Text.H2 class="text-center mb-4">{label()}</Text.H2>
					<Divider />
				</div>
				<div class="pb-8 pt-4 px-2 md:px-8 overflow-auto">
					<MediaSources.List
						data={mediaSources.data() || []}
						isLoading={mediaSources.data.loading}
						mediaSourceProps={mediaSourceProps}
					/>
				</div>
			</div>
		</Modal>
	);
};
