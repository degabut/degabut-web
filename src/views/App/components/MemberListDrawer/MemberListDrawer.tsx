import { IMember } from "@api";
import { Divider } from "@components/Divider";
import { Drawer } from "@components/Drawer";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useScreen } from "@hooks/useScreen";
import { useSettings } from "@hooks/useSettings";
import { useNavigate } from "@solidjs/router";
import { Component, For, Show } from "solid-js";
import { Member } from "./Member";

export const MemberListDrawer: Component = () => {
	const app = useApp();
	const { settings, setSettings } = useSettings();
	const screen = useScreen();
	const queue = useQueue();
	const navigate = useNavigate();

	const onClickRecommendation = (member: IMember) => {
		if (screen.lte.sm) app.setIsMemberOpen(false);
		navigate(`/app/recommendation/${member.id}`);
	};

	const sortedMembers = () => {
		if (!queue.data.voiceChannel) return [];
		const members = [...queue.data.voiceChannel.members];
		return members.sort((a, b) => a.displayName.localeCompare(b.displayName));
	};

	return (
		<Drawer
			right
			resizeable
			initialSize={settings.memberDrawerSize}
			onResize={(memberDrawerSize) => setSettings({ memberDrawerSize })}
			isOpen={app.isMemberOpen()}
			handleClose={() => app.setIsMemberOpen(false)}
			extraContainerClass="min-w-[4.25rem] max-w-[75vw] md:max-w-xs right-0"
		>
			{(size) => {
				const minimized = size <= 120;

				return (
					<>
						<Show
							when={!minimized || !queue.data.guild?.icon}
							fallback={
								<>
									<img
										title={queue.data.voiceChannel?.name}
										src={queue.data.guild?.icon || ""}
										class="w-10 h-10 mx-auto mt-2"
									/>
									<Divider dark extraClass="my-2" />
								</>
							}
						>
							<div class="text-xl font-bold truncate px-4 py-6">{queue.data.voiceChannel?.name}</div>
						</Show>

						<div class="overflow-y-auto overflow-x-hidden space-y-1.5 mx-2">
							<For each={sortedMembers()}>
								{(member) => (
									<Member
										minimized={minimized}
										member={member}
										onClickRecommendation={onClickRecommendation}
									/>
								)}
							</For>
						</div>
					</>
				);
			}}
		</Drawer>
	);
};
