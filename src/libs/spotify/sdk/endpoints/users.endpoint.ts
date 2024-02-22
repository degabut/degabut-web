import type { User } from "../types";
import { BaseEndpoint } from "./base";

export class UsersEndpoint extends BaseEndpoint {
	public profile(userId: string) {
		return this.getRequest<User>(`users/${userId}`);
	}
}
