import { AxiosInstance } from "axios";
import { ParentComponent, createContext } from "solid-js";
import { AuthManager, useApiProvider } from "./hooks";

export type ApiContextStore = {
	setClientUrl: (apiBaseUrl: string, youtubeBaseUrl: string) => void;
	authManager: AuthManager;
	client: AxiosInstance;
	youtubeClient: AxiosInstance;
};

export const ApiContext = createContext<ApiContextStore>({} as ApiContextStore);

export const ApiProvider: ParentComponent = (props) => {
	const apiProvider = useApiProvider();

	return <ApiContext.Provider value={apiProvider}>{props.children}</ApiContext.Provider>;
};
