import { useQueue } from "../providers";

export const usePlayerSpeed = () => {
	const queue = useQueue()!;

	const speed = () => (queue.data.filtersState.timescale.speed || 1) * (queue.data.filtersState.timescale.rate || 1);

	return speed;
};
