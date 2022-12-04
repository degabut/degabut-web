import { IVideoCompact } from "@api";
import { Videos } from "@components/Videos";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { getVideoContextMenu } from "@utils";
import { useNavigate } from "solid-app-router";
import { Component, Show } from "solid-js";
import { SeeMoreButton, SeeMoreTextButton } from "./SeeMoreButton";
import { Title } from "./Title";

type LabelProps = {
	isLoading: boolean;
	onClickMore: () => void;
	label: string;
};

export const Label: Component<LabelProps> = (props) => {
	return (
		<Title
			right={
				<Show when={!props.isLoading}>
					<SeeMoreTextButton extraClass="hidden md:block" onClick={() => props.onClickMore()} />
				</Show>
			}
		>
			{props.label}
		</Title>
	);
};

type Props = {
	onClickMore: () => void;
	videos: IVideoCompact[];
	label: string;
	double?: boolean;
	isLoading: boolean;
};

export const ExpandableVideoList: Component<Props> = (props) => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	const videoProps = (video: IVideoCompact) => ({
		video,
		contextMenu: getVideoContextMenu({
			appStore: app,
			queueStore: queue,
			navigate,
			video,
		}),
	});

	return (
		<div class="space-y-4">
			<Show
				when={props.double}
				fallback={
					<Videos.List
						label={<Label {...props} />}
						isLoading={props.isLoading}
						data={props.videos}
						videoProps={videoProps}
					/>
				}
			>
				<Videos.Double
					label={<Label {...props} />}
					isLoading={props.isLoading}
					data={props.videos}
					videoProps={videoProps}
				/>
			</Show>

			<Show when={!props.isLoading}>
				<SeeMoreButton extraClass="md:hidden" onClick={() => props.onClickMore()} />
			</Show>
		</div>
	);
};
