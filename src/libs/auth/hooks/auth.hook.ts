import { useApi } from "@common";
import { Auth } from "../apis";

export const useAuth = () => {
	const api = useApi();
	const auth = new Auth(api.client);
	return auth;
};
