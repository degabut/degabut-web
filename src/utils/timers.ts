import {
	clearInterval as wtClearInterval,
	clearTimeout as wtClearTimeout,
	setInterval as wtSetInterval,
	setTimeout as wtSetTimeout,
} from "worker-timers";
import { IS_DESKTOP } from "../constants";

const bcSetTimeout = IS_DESKTOP ? setTimeout : wtSetTimeout;
const bcClearTimeout = IS_DESKTOP ? clearTimeout : wtClearTimeout;

const bcSetInterval = IS_DESKTOP ? setInterval : wtSetInterval;
const bcClearInterval = IS_DESKTOP ? clearTimeout : wtClearInterval;

export {
	bcSetTimeout as setTimeout,
	bcClearTimeout as clearTimeout,
	bcSetInterval as setInterval,
	bcClearInterval as clearInterval,
};
