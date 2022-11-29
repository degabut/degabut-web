/* eslint-disable @typescript-eslint/no-explicit-any */
import { IVideoCompact } from "@api";
import { useScreen } from "@hooks/useScreen";
import { breakpoints } from "@providers/ScreenProvider/hooks";
import { Accessor, createContext, createEffect, createSignal, JSX, ParentComponent, Setter } from "solid-js";
import { AddPlaylistVideoModal, ConfirmationModal } from "./components";
import { defaultSettings, Settings, useSettings } from "./hooks";

type Confirmation = {
	title: JSX.Element;
	message?: JSX.Element;
	isAlert?: boolean;
	onConfirm?: () => void | Promise<void>;
};

export type AppContextStore = {
	title: Accessor<string>;
	setTitle: (title: string) => void;
	setVideoPlaylist: (video: IVideoCompact | null) => void;
	setConfirmation: (confirmation: Confirmation | null) => void;
	isMenuOpen: Accessor<boolean>;
	isMemberOpen: Accessor<boolean>;
	setIsMenuOpen: Setter<boolean>;
	setIsMemberOpen: Setter<boolean>;
	settings: Accessor<Settings>;
	setSettings: (settings: Partial<Settings>) => void;
};

export const AppContext = createContext<AppContextStore>({
	title: () => "",
	setTitle: () => {},
	setVideoPlaylist: () => {},
	setConfirmation: () => {},
	isMenuOpen: () => false,
	isMemberOpen: () => false,
	setIsMenuOpen: () => false as any,
	setIsMemberOpen: () => false as any,
	settings: () => defaultSettings,
	setSettings: () => {},
});

export const AppProvider: ParentComponent = (props) => {
	let previousWidth = window.screenX;
	const screen = useScreen();
	const settings = useSettings();

	const [isMenuOpen, setIsMenuOpen] = createSignal(window.innerWidth > breakpoints.md);
	const [isMemberOpen, setIsMemberOpen] = createSignal(window.innerWidth > breakpoints["2xl"]);
	const [title, setTitle] = createSignal("");
	const [videoPlaylist, setVideoPlaylist] = createSignal<null | IVideoCompact>(null);
	const [confirmation, setConfirmation] = createSignal<Confirmation | null>(null);

	createEffect(() => {
		if (screen().gte.md) setIsMenuOpen(true);
		if (screen().gte["2xl"]) setIsMemberOpen(true);
		if (window.innerWidth <= breakpoints.md && previousWidth > breakpoints.md) setIsMenuOpen(false);
		if (window.innerWidth <= breakpoints["2xl"] && previousWidth > breakpoints["2xl"]) setIsMemberOpen(false);
		previousWidth = window.innerWidth;
	});

	const store = {
		title,
		setTitle,
		setVideoPlaylist,
		setConfirmation,
		isMenuOpen,
		isMemberOpen,
		setIsMenuOpen,
		setIsMemberOpen,
		...settings,
	};

	return (
		<AppContext.Provider value={store}>
			{props.children}
			<AddPlaylistVideoModal
				video={videoPlaylist()}
				isOpen={!!videoPlaylist()}
				onClose={() => setVideoPlaylist(null)}
			/>
			<ConfirmationModal
				isOpen={!!confirmation()}
				title={confirmation()?.title || ""}
				message={confirmation()?.message}
				isAlert={!!confirmation()?.isAlert}
				onConfirm={async () => {
					await confirmation()?.onConfirm?.();
					setConfirmation(null);
				}}
				onClose={() => setConfirmation(null)}
			/>
		</AppContext.Provider>
	);
};
