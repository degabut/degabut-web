import { debounce } from "@utils";
import { createEffect, createResource, createSignal } from "solid-js";
import { useApi } from "./useApi";

type Params = {
	debounce?: number;
};

export const useSearchYouTube = (params: Params = {}) => {
	const api = useApi();

	const [keyword, setKeyword] = createSignal("");
	const [debouncedKeyword, _setDebouncedKeyword] = createSignal("");

	const setDebouncedKeyword = debounce((v: string) => _setDebouncedKeyword(v), params.debounce || 350);
	createEffect(() => setDebouncedKeyword(keyword()));

	const [result] = createResource(debouncedKeyword, async (keyword) => {
		return await api.youtube.search(keyword);
	});

	const isLoading = () => result.loading;

	return {
		keyword,
		setKeyword,
		debouncedKeyword,
		result: () => result() || [],
		isLoading,
	};
};
