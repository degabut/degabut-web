import { IVideoCompact } from "@api";
import { getVideoContextMenu } from "@components/Video";
import { Videos } from "@components/Videos";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useNavigate } from "solid-app-router";
import { Component, Show } from "solid-js";
import { SeeMoreButton, SeeMoreTextButton } from "./SeeMoreButton";
import { Title } from "./Title";

type Props = {
	onClickMore: () => void;
	videos: IVideoCompact[];
	label: string;
	isLoading: boolean;
};

export const ExpandableVideoList: Component<Props> = (props) => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	return (
		<div class="space-y-4">
			<Videos.List
				label={
					<Title
						right={
							<Show when={!props.isLoading}>
								<SeeMoreTextButton extraClass="hidden md:block" onClick={() => props.onClickMore()} />
							</Show>
						}
					>
						{props.label}
					</Title>
				}
				isLoading={props.isLoading}
				data={props.videos}
				videoProps={(video) => ({
					video,
					contextMenu: getVideoContextMenu({
						appStore: app,
						queueStore: queue,
						navigate,
						video,
					}),
				})}
			/>
			<Show when={!props.isLoading}>
				<SeeMoreButton extraClass="md:hidden" onClick={() => props.onClickMore()} />
			</Show>
		</div>
	);
};
