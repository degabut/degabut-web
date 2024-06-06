import { type Accessor } from "solid-js";
import { useMediaSourceLikeManager } from "../providers";

export const useLikeMediaSource = (id: Accessor<string>) => {
	const mediaSourceLikeManager = useMediaSourceLikeManager();
	if (!mediaSourceLikeManager) return;

	const isLiked = () => mediaSourceLikeManager.liked[id()];
	const like = () => mediaSourceLikeManager.like(id());
	const unlike = () => mediaSourceLikeManager.unlike(id());

	return {
		isLiked,
		like,
		unlike,
	};
};
