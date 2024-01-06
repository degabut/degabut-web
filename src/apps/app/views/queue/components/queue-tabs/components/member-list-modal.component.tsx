import { Divider, Item, Modal, Text } from "@common/components";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { Component, For } from "solid-js";

type MemberListModalProps = {
	isOpen: boolean;
	handleClose: () => void;
};

export const MemberListModal: Component<MemberListModalProps> = (props) => {
	const queue = useQueue();
	const navigate = useNavigate();

	return (
		<Modal
			isOpen={props.isOpen}
			closeOnEscape
			onClickOutside={() => props.handleClose()}
			extraContainerClass="w-[32rem] top-[15vh] h-[90vh] md:h-[70vh]"
		>
			<div class="flex flex-col h-full">
				<div class="pt-4 md:pt-8 px-2 md:px-8">
					<Text.H2 class="text-center mb-4">Listeners</Text.H2>
					<Divider extraClass="my-4" />
				</div>

				<div class="flex flex-col py-8 px-4 md:p-8 !pt-0 space-y-2 overflow-auto">
					<For each={[...queue.data.voiceChannel.members].sort((a) => (a.isInVoiceChannel ? -1 : 1))}>
						{(member) => (
							<Item.List
								contextMenu={{
									openWithClick: true,
									header: (
										<div class="flex-row-center justify-center space-x-4 py-4 pb-8 w-full">
											<img
												src={member.avatar || "/img/avatar.png"}
												class="rounded-full w-16 h-16"
											/>
											<div class="space-y-2">
												<Text.H3>{member.displayName}</Text.H3>
												<Text.Body2>{member.username}</Text.Body2>
											</div>
										</div>
									),
									items: [
										{
											label: "View Recommendation",
											icon: "heart",
											onClick: () => navigate(`/recommendation/${member.id}`),
										},
										{
											label: "Remove Requested Tracks",
											icon: "closeLine",
											onClick: () => queue.removeTracksByMemberId(member.id),
										},
									],
								}}
								title={member.displayName}
								extra={() => <Text.Caption1>{member.username}</Text.Caption1>}
								extraContainerClassList={{
									"opacity-50": !member.isInVoiceChannel,
								}}
								imageUrl={member.avatar || "/img/avatar.png"}
								extraImageClass="rounded-full"
							/>
						)}
					</For>
				</div>
			</div>
		</Modal>
	);
};
