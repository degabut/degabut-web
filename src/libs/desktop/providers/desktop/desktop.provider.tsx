import { IS_DESKTOP, PROD } from "@constants";
import type { IRichPresence } from "@discord";
import { createContext, createSignal, useContext, type Accessor, type ParentComponent } from "solid-js";

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

type DesktopContextStore = {
	ipc: Partial<DesktopAPI>;
	isUpdateReady: Accessor<boolean>;
};

const DesktopContext = createContext<DesktopContextStore>();

export const DesktopProvider: ParentComponent = (props) => {
	// eslint-disable-next-line solid/components-return-once
	if (!("desktopAPI" in window)) return <>{props.children}</>;
	if (IS_DESKTOP && PROD) document.addEventListener("contextmenu", (e) => e.preventDefault());

	const ipc = window.desktopAPI as Partial<DesktopAPI>;
	const [isUpdateReady, setIsUpdateReady] = createSignal(false);

	ipc.handleUpdateDownloaded?.(() => setIsUpdateReady(true));

	return <DesktopContext.Provider value={{ ipc, isUpdateReady }}>{props.children}</DesktopContext.Provider>;
};

export const useDesktop = () => useContext(DesktopContext);
