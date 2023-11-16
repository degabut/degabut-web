/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import EventEmitter from "events";
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

export interface DesktopAPI {
	onAuthenticated: () => void;
	onSettingsChanged: (key: string, after: unknown, before: unknown) => void;

	setActivity: (presence: Presence) => void;
	clearActivity: () => void;
	authenticateRpc: (clientId: string, clientSecret: string) => void;
	setBotVolume: (volume: number, id: string) => void;

	quitAndInstallUpdate: () => void;
	handleUpdateDownloaded: (callback: () => void) => void;
}

interface Desktop extends DesktopAPI {}
class Desktop extends EventEmitter {
	private desktopAPI: DesktopAPI;

	constructor(desktopAPI: DesktopAPI) {
		super();
		Object.assign(this, desktopAPI);
		this.desktopAPI = desktopAPI;
		this.listen();
	}

	private listen() {
		this.desktopAPI.handleUpdateDownloaded(() => this.emit("update-downloaded"));
	}
}

export type DesktopContextStore = {
	ipc: DesktopAPI & EventEmitter;
	isUpdateReady: Accessor<boolean>;
};

export const DesktopContext = createContext<DesktopContextStore | undefined>();

export const DesktopProvider: ParentComponent = (props) => {
	// eslint-disable-next-line solid/components-return-once
	if (!("desktopAPI" in window)) return <>{props.children}</>;

	const ipc = new Desktop(window.desktopAPI as DesktopAPI);
	const [isUpdateReady, setIsUpdateReady] = createSignal(false);

	ipc.on("update-downloaded", () => setIsUpdateReady(true));

	return <DesktopContext.Provider value={{ ipc, isUpdateReady }}>{props.children}</DesktopContext.Provider>;
};
