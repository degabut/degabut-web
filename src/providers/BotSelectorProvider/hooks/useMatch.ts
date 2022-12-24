import { useLocation } from "@solidjs/router";
import { Accessor, createMemo } from "solid-js";

export const useMatch = (path: Accessor<string>) => {
	const location = useLocation();

	const isMatch = createMemo(() => {
		const currentPath = location.pathname;
		const serializedCurrentPath = "/app/" + currentPath.replace(/\/app(\/\d+)?\//, "");
		return serializedCurrentPath === path();
	});

	return isMatch;
};
