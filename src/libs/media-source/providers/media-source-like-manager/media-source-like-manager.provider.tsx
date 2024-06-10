import { DelayUtil, useApi } from "@common";
import { useQueue } from "@queue";
import { useSpotify } from "@spotify";
import { UserApi, type LikedMediaSourceDict } from "@user";
import { type AxiosResponse } from "axios";
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
	const spotify = useSpotify();
	const queue = useQueue();
	const user = new UserApi(api.client);
	const [liked, setLiked] = createStore<LikedMediaSourceDict>({});
	let queuedIds: string[] = [];

	onMount(() => {
		api.client.interceptors.response.use(responseInterceptor);
		api.youtubeClient.interceptors.response.use(youtubeResponseInterceptor);
		spotify.client.httpClient.interceptors.response.use(spotifyResponseInterceptor);
		if (queue.emitter) queue.emitter.on("message", extractMediaSourceIds);
	});

	const responseInterceptor = (res: AxiosResponse) => {
		const request = res.request as XMLHttpRequest;

		if (typeof request.response === "string" && request.response) {
			extractMediaSourceIds(request.response);
		}

		return res;
	};

	const extractMediaSourceIds = (data: string) => {
		// find media source id in response
		const pattern = /(?<=")(youtube|spotify)\/[a-zA-Z0-9_-]+(?=")/g;
		const matched = data.match(pattern) || [];
		queueIds(matched);
	};

	const youtubeResponseInterceptor = (res: AxiosResponse) => {
		const request = res.request as XMLHttpRequest;

		if (typeof request.response === "string" && request.response) {
			// match youtube video ids inside quotes
			const pattern = /(?<=")[a-zA-Z0-9_-]{11}(?=")/g;
			const matched = request.response.match(pattern) || [];
			queueIds(matched.map((id) => `youtube/${id}`));
		}

		return res;
	};

	const spotifyResponseInterceptor = (res: AxiosResponse) => {
		const request = res.request as XMLHttpRequest;

		if (typeof request.response === "string" && request.response) {
			// match youtube video ids inside quotes
			const pattern = /(?<=")[a-zA-Z0-9]{22}(?=")/g;
			const matched = request.response.match(pattern) || [];
			queueIds(matched.map((id) => `spotify/${id}`));
		}

		return res;
	};

	const queueIds = (ids: string[]) => {
		ids = [...new Set(ids)];
		ids = ids.filter((id) => !(id in liked) && !queuedIds.includes(id));
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
