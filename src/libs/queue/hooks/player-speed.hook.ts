import { useQueue } from "../providers";

export const usePlayerSpeed = () => {
	const queue = useQueue()!;

	const speed = () => {
		if (!queue.data.filtersState.timescale.enabled) return 1;
		return (queue.data.filtersState.timescale.speed || 1) * (queue.data.filtersState.timescale.rate || 1);
	};

	return speed;
};
