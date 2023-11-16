import { Accessor, ParentComponent, createContext, createSignal } from "solid-js";

type Presence = {
	details: string;
	state: string | undefined;
	largeImageText: string;
	largeImageKey: string;
	smallImageKey?: string;
	smallImageText?: string;
	startTimestamp?: number | null;
	buttons?: {
		label: string;
		url: string;
	}[];
};

interface DesktopAPI {
	onAuthenticated: () => void;
	onSettingsChanged: (key: string, after: unknown, before: unknown) => void;

	setActivity: (presence: Presence) => void;
	clearActivity: () => void;
	authenticateRpc: (clientId: string, clientSecret: string) => void;
	setBotVolume: (volume: number, id: string) => void;

	quitAndInstallUpdate: () => void;
	handleUpdateDownloaded: (callback: () => void) => void;
}

export type DesktopContextStore = {
	ipc: DesktopAPI;
	isUpdateReady: Accessor<boolean>;
};

export const DesktopContext = createContext<DesktopContextStore | undefined>();

export const DesktopProvider: ParentComponent = (props) => {
	// eslint-disable-next-line solid/components-return-once
	if (!("desktopAPI" in window)) return <>{props.children}</>;

	const ipc = window.desktopAPI as DesktopAPI;
	const [isUpdateReady, setIsUpdateReady] = createSignal(false);

	ipc.handleUpdateDownloaded(() => setIsUpdateReady(true));

	return <DesktopContext.Provider value={{ ipc, isUpdateReady }}>{props.children}</DesktopContext.Provider>;
};
