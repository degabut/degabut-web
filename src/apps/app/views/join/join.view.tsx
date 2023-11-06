import { useQueue } from "@app/hooks";
import { Text } from "@common/components";
import { useNavigate, useParams, useSearchParams } from "@solidjs/router";
import { Component, onMount } from "solid-js";

type Params = {
	voiceChannelId: string;
	textChannelId?: string;
};

type SearchParams = Params & {
	bot?: string;
};

export const Join: Component = () => {
	const queue = useQueue();
	const navigate = useNavigate();
	const params = useParams<{ voiceChannelId: string; textChannelId?: string }>();
	const [searchParams] = useSearchParams<SearchParams>();

	onMount(async () => {
		const voiceChannelId = params.voiceChannelId || searchParams.voiceChannelId;
		const textChannelId = params.textChannelId || searchParams.textChannelId;
		if (params.voiceChannelId) {
			if (searchParams.bot) queue.setBot(+searchParams.bot);
			await queue.join(voiceChannelId, textChannelId);
		}
		navigate("/app");
	});

	return (
		<div class="flex-row-center justify-center h-full">
			<Text.H2 class="text-xl">Loading...</Text.H2>
		</div>
	);
};
