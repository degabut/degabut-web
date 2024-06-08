import { DelayUtil, useApi } from "@common";
import { useQueue } from "@queue";
import { UserApi, type LikedMediaSourceDict } from "@user";
import axios, { type AxiosResponse } from "axios";
import { createContext, onMount, useContext, type ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";

export type MediaSourceLikeManagerContextStore = {
	liked: Record<string, boolean>;
	like: (mediaSourceId: string) => Promise<void>;
	unlike: (mediaSourceId: string) => Promise<void>;
};

export const MediaSourceLikeManagerContext = createContext<MediaSourceLikeManagerContextStore>();

export const MediaSourceLikeManagerProvider: ParentComponent = (props) => {
	const api = useApi();
	const queue = useQueue();
	const user = new UserApi(api.client);
	const [liked, setLiked] = createStore<LikedMediaSourceDict>({});
	let queuedIds: string[] = [];

	onMount(() => {
		axios.interceptors.response.use((r) => responseInterceptor(r));
		api.client.interceptors.response.use((r) => responseInterceptor(r));
		api.youtubeClient.interceptors.response.use((r) => responseInterceptor(r));
		if (queue?.emitter) queue.emitter.on("message", extractMediaSourceIds);
	});

	const responseInterceptor = (res: AxiosResponse) => {
		if (res.data) extractMediaSourceIds(res.data);
		return res;
	};

	const extractMediaSourceIds = (data: unknown) => {
		// find media source id in response
		const pattern = /(?<=")(youtube|spotify)\/[a-zA-Z0-9_-]+(?=")/g;
		const matched = JSON.stringify(data).match(pattern);

		const uniqueIds = [...new Set(matched)];
		queueIds(uniqueIds);
	};

	const queueIds = (ids: string[]) => {
		ids = ids.filter((id) => !(id in liked));
		ids = ids.filter((id) => !queuedIds.includes(id));
		if (!ids.length) return;

		queuedIds.push(...ids);
		fetchLikedStatus();
	};

	const fetchLikedStatus = DelayUtil.throttle(
		async () => {
			if (!queuedIds.length) return;

			const ids = queuedIds;
			queuedIds = [];

			const initialValues: LikedMediaSourceDict = {};
			for (const id of ids) initialValues[id] = false;
			setLiked((c) => ({ ...c, ...initialValues }));

			const result = await user.getIsLikedMediaSource(ids);
			setLiked((c) => ({ ...c, ...result }));
		},
		500,
		{ leading: false }
	);

	const like = async (mediaSourceId: string) => {
		setLiked(mediaSourceId, true);
		await user.likeMediaSource(mediaSourceId);
	};

	const unlike = async (mediaSourceId: string) => {
		setLiked(mediaSourceId, false);
		await user.unlikeMediaSource(mediaSourceId);
	};

	const store = { liked, like, unlike };

	return (
		<MediaSourceLikeManagerContext.Provider value={store}>{props.children}</MediaSourceLikeManagerContext.Provider>
	);
};

export const useMediaSourceLikeManager = () => useContext(MediaSourceLikeManagerContext);
