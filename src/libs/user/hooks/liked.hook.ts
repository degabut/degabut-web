import { useApi } from "@common";
import { createEffect, createResource } from "solid-js";
import { createStore } from "solid-js/store";
import { UserApi, type ILikedMediaSource } from "../apis";

export const useLiked = (limit = 100) => {
	const api = useApi();
	const user = new UserApi(api.client);
	const [data, setData] = createStore<ILikedMediaSource[]>([]);
	let page = 1;

	const [_data, actions] = createResource(() => user.getLikedMediaSource(page, limit), { initialValue: [] });

	createEffect(() => {
		const data = _data();
		if (!data?.length) return;

		setData((d) => [...d, ...data]);
	});

	const next = () => {
		page++;
		actions.refetch();
	};

	const isLoading = () => _data.loading;
	const isFetchable = () => !_data.loading && _data().length === limit;

	return {
		data,
		next,
		isLoading,
		isFetchable,
	};
};
