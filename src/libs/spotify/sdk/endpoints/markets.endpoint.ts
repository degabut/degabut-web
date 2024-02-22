import type { Markets } from "../types";
import { BaseEndpoint } from "./base";

export class MarketsEndpoint extends BaseEndpoint {
	public getAvailableMarkets() {
		return this.getRequest<Markets>("markets");
	}
}
