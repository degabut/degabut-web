import { AppRoutes } from "@app/routes";
import { Divider, Icon, Item, Modal, Text, useNavigate } from "@common";
import { useQueue, type IMember } from "@queue";
import { For, Show, type Component } from "solid-js";

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
					<For
						each={[...queue.data.voiceChannel.members].sort((a) =>
							a.isInVoiceChannel || a.isLink ? -1 : 1
						)}
					>
						{(member) => {
							const isExcludedFromAutoplay = () =>
								queue.data.autoplayOptions.excludedMemberIds.includes(member.id) ||
								queue.data.voiceChannel.members.some(
									(m) => m.id === member.id && !m.isInVoiceChannel && !m.isLink
								);

							const isInQueue = () => member.isInVoiceChannel || member.isLink;

							return (
								<MemberList
									member={member}
									isInQueue={isInQueue()}
									isExcludedFromAutoplay={isExcludedFromAutoplay()}
									onClickRecommendation={() =>
										navigate(AppRoutes.Recommendation, { params: { id: member.id } })
									}
									onRemoveRequestedTracks={() => queue.removeTracksByMemberId(member.id)}
									onToggleAutoplay={() =>
										queue.changeAutoplayOptions({
											addExcludedMemberId: isExcludedFromAutoplay() ? undefined : member.id,
											removeExcludedMemberId: isExcludedFromAutoplay() ? member.id : undefined,
										})
									}
								/>
							);
						}}
					</For>
				</div>
			</div>
		</Modal>
	);
};

type MemberListProps = {
	member: IMember;
	isExcludedFromAutoplay: boolean;
	isInQueue: boolean;
	onClickRecommendation: () => void;
	onRemoveRequestedTracks: () => void;
	onToggleAutoplay: () => void;
};

const MemberList: Component<MemberListProps> = (props) => {
	return (
		<Item.List
			contextMenu={{
				openWithClick: true,
				header: (
					<div class="flex-row-center justify-center space-x-4 pb-8 w-full">
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
						disabled: !props.isInQueue,
						onClick: () => props.onClickRecommendation(),
					},
					{
						label: "Remove Requested Tracks",
						icon: "closeLine",
						onClick: () => props.onRemoveRequestedTracks(),
					},
					{
						label: props.isExcludedFromAutoplay ? "Include in Autoplay" : "Exclude from Autoplay",
						icon: "stars",
						disabled: !props.isInQueue,
						onClick: () => props.onToggleAutoplay(),
					},
				],
			}}
			title={props.member.displayName}
			extra={() => (
				<div class="flex-row-center space-x-1.5">
					<Show when={props.member.isLink}>
						<div title="Link">
							<Icon name="link" class="text-brand-500" />
						</div>
					</Show>
					<div title={props.isExcludedFromAutoplay ? "Excluded from Autoplay" : "Included in Autoplay"}>
						<Icon
							name={props.isExcludedFromAutoplay ? "starsLine" : "stars"}
							class={props.isExcludedFromAutoplay ? "opacity-25" : "text-brand-500"}
						/>
					</div>
					<Text.Caption1>{props.member.username}</Text.Caption1>
				</div>
			)}
			extraContainerClassList={{
				"opacity-25 hover:opacity-50": !props.isInQueue,
			}}
			imageUrl={props.member.avatar || "/img/avatar.png"}
			extraImageClass="rounded-full"
		/>
	);
};
