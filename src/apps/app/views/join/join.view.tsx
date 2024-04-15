import { AppRoutes } from "@app/routes";
import { Container, Spinner, useNavigate } from "@common";
import { useQueue } from "@queue";
import { useParams, useSearchParams } from "@solidjs/router";
import { onMount, type Component } from "solid-js";

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
	const params = useParams<Params>();
	const [searchParams] = useSearchParams<SearchParams>();

	onMount(async () => {
		const voiceChannelId = params.voiceChannelId || searchParams.voiceChannelId;
		const textChannelId = params.textChannelId || searchParams.textChannelId;
		try {
			if (voiceChannelId) {
				if (searchParams.bot) queue.setBot(+searchParams.bot);
				await queue.join(voiceChannelId, textChannelId);
			}
		} finally {
			navigate(AppRoutes.Queue);
		}
	});

	return (
		<Container size="content" centered extraClass="flex items-center h-full">
			<Spinner size="3xl" />
		</Container>
	);
};
