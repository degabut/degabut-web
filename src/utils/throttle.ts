export const throttle = <T extends CallableFunction>(cb: T, limit: number): T => {
	let timeout: NodeJS.Timeout | null;
	return ((...args: unknown[]) => {
		if (!timeout) {
			timeout = setTimeout(() => {
				cb(...args);
				timeout = null;
			}, limit);
		}
	}) as unknown as T;
};

type CountedCallableFunction = (count: number) => void;

export const countedThrottle = (cb: CountedCallableFunction, limit: number) => {
	let timeout: NodeJS.Timeout | null;
	let count = 0;
	return () => {
		count++;
		if (!timeout) {
			timeout = setTimeout(() => {
				cb(count);
				count = 0;
				timeout = null;
			}, limit);
		}
	};
};
