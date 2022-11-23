export const debounce = <T extends CallableFunction>(cb: T, limit: number) => {
	let timeout: NodeJS.Timeout;

	return (...args: unknown[]) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => cb(...args), limit);
	};
};
