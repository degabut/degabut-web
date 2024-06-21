import { AppRoutes } from "@app/routes";
import { Divider, Item, Modal, Text, useNavigate } from "@common";
import { useQueue, type IMember } from "@queue";
import { For, type Component } from "solid-js";

type MemberListModalProps = {
	isOpen: boolean;
	handleClose: () => void;
};

export const MemberListModal: Component<MemberListModalProps> = (props) => {
	const queue = useQueue()!;
	const navigate = useNavigate();

	return (
		<Modal
			isOpen={props.isOpen}
			closeOnEscape
			handleClose={() => props.handleClose()}
			extraContainerClass="w-[32rem] h-[90vh] md:h-[70vh]"
		>
			<div class="flex flex-col h-full">
				<div class="pt-4 md:pt-8 px-2 md:px-8">
					<Text.H2 class="text-center mb-4">Listeners</Text.H2>
					<Divider extraClass="my-4" />
				</div>

				<div class="flex flex-col py-8 px-4 md:p-8 !pt-0 space-y-2 overflow-auto">
					<For each={[...queue.data.voiceChannel.members].sort((a) => (a.isInVoiceChannel ? -1 : 1))}>
						{(member) => (
							<MemberList
								member={member}
								onClickRecommendation={() =>
									navigate(AppRoutes.Recommendation, { params: { id: member.id } })
								}
								onRemoveRequestedTracks={() => queue.removeTracksByMemberId(member.id)}
							/>
						)}
					</For>
				</div>
			</div>
		</Modal>
	);
};

type MemberListProps = {
	member: IMember;
	onClickRecommendation: () => void;
	onRemoveRequestedTracks: () => void;
};

const MemberList: Component<MemberListProps> = (props) => {
	return (
		<Item.List
			contextMenu={{
				openWithClick: true,
				header: (
					<div class="flex-row-center justify-center space-x-4 py-4 pb-8 w-full">
						<img src={props.member.avatar || "/img/avatar.png"} class="rounded-full w-16 h-16" />
						<div class="space-y-2">
							<Text.H3>{props.member.displayName}</Text.H3>
							<Text.Body2>{props.member.username}</Text.Body2>
						</div>
					</div>
				),
				items: [
					{
						label: "View Recommendation",
						icon: "heart",
						disabled: !props.member.isInVoiceChannel,
						onClick: () => props.onClickRecommendation(),
					},
					{
						label: "Remove Requested Tracks",
						icon: "closeLine",
						onClick: () => props.onRemoveRequestedTracks(),
					},
				],
			}}
			title={props.member.displayName}
			extra={() => <Text.Caption1>{props.member.username}</Text.Caption1>}
			extraContainerClassList={{
				"opacity-25 hover:opacity-50": !props.member.isInVoiceChannel,
			}}
			imageUrl={props.member.avatar || "/img/avatar.png"}
			extraImageClass="rounded-full"
		/>
	);
};
