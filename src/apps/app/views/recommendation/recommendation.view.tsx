import { useApp } from "@app/providers";
import { Container, Tabs } from "@common";
import { useQueue } from "@queue";
import { useParams } from "@solidjs/router";
import { createEffect, createMemo, Show, type Component } from "solid-js";
import { ForYou, Timeline } from "./components";

export const Recommendation: Component = () => {
	const app = useApp()!;
	const queue = useQueue()!;
	const params = useParams<{ id?: string }>();

	const targetUser = createMemo(() => {
		return queue.data.voiceChannel?.members.find((m) => m.id === params.id);
	});

	createEffect(() => {
		const user = targetUser();
		app.setTitle(user ? `${user.displayName} recommendation` : "Recommendation");
	});

	return (
		<>
			<Container size="xl" extraClass="h-full pt-4" bottomPadless>
				<Show
					when={targetUser()}
					fallback={
						<Tabs
							extraContainerClass="h-full"
							extraTabsClass="md:w-max !px-0"
							extraContentContainerClass="h-full md:py-8 py-4 pr-4 overflow-y-auto"
							items={[
								{
									id: "for-you",
									element: () => <ForYou />,
									labelText: "For You",
								},
								{
									id: "timeline",
									element: () => <Timeline />,
									labelText: "Timeline",
								},
							]}
						/>
					}
				>
					<ForYou />
				</Show>
			</Container>
		</>
	);
};
