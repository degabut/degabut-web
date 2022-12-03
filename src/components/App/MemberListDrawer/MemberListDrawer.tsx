import { IMember } from "@api";
import { Drawer } from "@components/Drawer";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useScreen } from "@hooks/useScreen";
import { useNavigate } from "solid-app-router";
import { Component, For } from "solid-js";
import { Member } from "./Member";

export const MemberListDrawer: Component = () => {
	const app = useApp();
	const screen = useScreen();
	const queue = useQueue();
	const navigate = useNavigate();

	const onClickRecommendation = (member: IMember) => {
		if (screen().lte.sm) app.setIsMemberOpen(false);
		navigate(`/app/recommendation/${member.id}`);
	};

	return (
		<Drawer
			isOpen={app.isMemberOpen()}
			handleClose={() => app.setIsMemberOpen(false)}
			extraContainerClass="right-0"
		>
			<div class="text-xl font-bold truncate px-4 py-6">{queue.data.voiceChannel?.name}</div>
			<div class="overflow-y-auto overflow-x-hidden space-y-1.5 mx-2">
				<For each={queue.data.voiceChannel?.members || []}>
					{(member) => <Member member={member} onClickRecommendation={onClickRecommendation} />}
				</For>
			</div>
		</Drawer>
	);
};
