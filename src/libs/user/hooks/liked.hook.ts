import { useApi } from "@common";
import { createEffect, createResource } from "solid-js";
import { createStore } from "solid-js/store";
import { UserApi, type ILikedMediaSource } from "../apis";

type Params = {
	limit?: number;
	onLoad?: () => void;
};

export const useLiked = (params: Params) => {
	const api = useApi();
	const user = new UserApi(api.client);
	const [data, setData] = createStore<ILikedMediaSource[]>([]);
	let page = 1;

	const [_data, actions] = createResource(() => user.getLikedMediaSource(page, params.limit), { initialValue: [] });

	createEffect(() => {
		const data = _data();
		if (!data?.length) return;

		setData((d) => [...d, ...data]);
		params.onLoad && setTimeout(params.onLoad, 0);
	});

	const next = () => {
		page++;
		actions.refetch();
	};

	const isLoading = () => _data.loading;
	const isFetchable = () => !_data.loading && _data().length === params.limit;

	return {
		data,
		next,
		isLoading,
		isFetchable,
	};
};
