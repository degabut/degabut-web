/* eslint-disable @typescript-eslint/no-explicit-any */
import { IVideoCompact } from "@api";
import { breakpoints } from "@constants";
import { useScreen } from "@hooks/useScreen";
import { useShortcut } from "@hooks/useShortcut";
import { useNavigate } from "solid-app-router";
import { Accessor, createContext, createEffect, createSignal, JSX, ParentComponent, Setter } from "solid-js";
import {
	AddPlaylistVideoModal,
	CatJamManager,
	ConfirmationModal,
	ExternalDragDrop,
	InstallPrompt,
	QuickSearchModal,
	UpdateModal,
} from "./components";

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
	setIsQuickSearchModalOpen: Setter<boolean>;
	setIsMenuOpen: Setter<boolean>;
	setIsMemberOpen: Setter<boolean>;
};

export const AppContext = createContext<AppContextStore>({
	title: () => "",
	setTitle: () => {},
	setVideoPlaylist: () => {},
	setConfirmation: () => {},
	isMenuOpen: () => false,
	isMemberOpen: () => false,
	setIsQuickSearchModalOpen: () => false as any,
	setIsMenuOpen: () => false as any,
	setIsMemberOpen: () => false as any,
});

export const AppProvider: ParentComponent = (props) => {
	let previousWidth = window.screenX;
	const screen = useScreen();
	const navigate = useNavigate();

	const [isMenuOpen, setIsMenuOpen] = createSignal(window.innerWidth > breakpoints.md);
	const [isMemberOpen, setIsMemberOpen] = createSignal(window.innerWidth > breakpoints["2xl"]);
	const [title, setTitle] = createSignal("");
	const [videoPlaylist, setVideoPlaylist] = createSignal<null | IVideoCompact>(null);
	const [isQuickSearchModalOpen, setIsQuickSearchModalOpen] = createSignal(false);
	const [confirmation, setConfirmation] = createSignal<Confirmation | null>(null);

	createEffect(() => {
		if (screen.gte.md) setIsMenuOpen(true);
		if (screen.gte["2xl"]) setIsMemberOpen(true);
		if (window.innerWidth <= breakpoints.md && previousWidth > breakpoints.md) setIsMenuOpen(false);
		if (window.innerWidth <= breakpoints["2xl"] && previousWidth > breakpoints["2xl"]) setIsMemberOpen(false);
		previousWidth = window.innerWidth;
	});

	useShortcut({
		shortcuts: [
			{ key: "k", ctrl: true, handler: () => setIsQuickSearchModalOpen(true) },
			{ key: "p", handler: () => setIsQuickSearchModalOpen(true) },
			{ key: "z", ctrl: true, handler: () => navigate("/app/queue/zen") },
		],
	});

	const store = {
		title,
		setTitle,
		setVideoPlaylist,
		setConfirmation,
		isMenuOpen,
		isMemberOpen,
		setIsQuickSearchModalOpen,
		setIsMenuOpen,
		setIsMemberOpen,
	};

	return (
		<AppContext.Provider value={store}>
			{props.children}

			<QuickSearchModal isOpen={isQuickSearchModalOpen()} onDone={() => setIsQuickSearchModalOpen(false)} />

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

			<CatJamManager />
			<ExternalDragDrop />
			<InstallPrompt />
			<UpdateModal />
		</AppContext.Provider>
	);
};
