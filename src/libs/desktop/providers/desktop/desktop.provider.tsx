import { IRichPresence } from "@discord/hooks";
import { Accessor, ParentComponent, createContext, createSignal } from "solid-js";

interface DesktopAPI {
	onAuthenticated: () => void;
	onLoggedOut: () => void;
	onSettingsChanged: (key: string, after: unknown, before: unknown) => void;

	setActivity: (presence: IRichPresence) => void;
	clearActivity: () => void;
	authenticateRpc: (clientId: string, clientSecret: string) => void;
	setBotVolume: (volume: number, id: string) => void;

	quitAndInstallUpdate: () => void;
	handleUpdateDownloaded: (callback: () => void) => void;
}

export type DesktopContextStore = {
	ipc: Partial<DesktopAPI>;
	isUpdateReady: Accessor<boolean>;
};

export const DesktopContext = createContext<DesktopContextStore | undefined>();

export const DesktopProvider: ParentComponent = (props) => {
	// eslint-disable-next-line solid/components-return-once
	if (!("desktopAPI" in window)) return <>{props.children}</>;

	const ipc = window.desktopAPI as Partial<DesktopAPI>;
	const [isUpdateReady, setIsUpdateReady] = createSignal(false);

	ipc.handleUpdateDownloaded?.(() => setIsUpdateReady(true));

	return <DesktopContext.Provider value={{ ipc, isUpdateReady }}>{props.children}</DesktopContext.Provider>;
};
