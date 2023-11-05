import debounce from "lodash/debounce";
import throttle from "lodash/throttle";

type CountedCallableFunction = (count: number) => void;

export class DelayUtil {
	static countedThrottle(cb: CountedCallableFunction, limit: number) {
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
	}

	static throttle = throttle;
	static debounce = debounce;
}
