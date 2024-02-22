import type { ItemTypes, Market, MaxInt, SearchResults } from "../types";
import { BaseEndpoint } from "./base";

export interface SearchExecutionFunction {
	<const T extends readonly ItemTypes[]>(
		q: string,
		type: T,
		market?: Market,
		limit?: MaxInt<50>,
		offset?: number,
		include_external?: string
	): Promise<SearchResults<T>>;
}

export class SearchEndpoint extends BaseEndpoint {
	public async execute<const T extends readonly ItemTypes[]>(
		q: string,
		type: T,
		market?: Market,
		limit?: MaxInt<50>,
		offset?: number,
		include_external?: string
	) {
		const params = this.paramsFor({
			q,
			type,
			market,
			limit,
			offset,
			include_external,
		});
		return await this.getRequest<SearchResults<T>>(`search${params}`);
	}
}
