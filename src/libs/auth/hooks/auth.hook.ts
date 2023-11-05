import { Auth } from "@auth/apis";
import { useApi } from "@common/hooks";

export const useAuth = () => {
	const api = useApi();
	const auth = new Auth(api.client);
	return auth;
};
