/* eslint-disable @typescript-eslint/no-explicit-any */
import { useShortcut } from "@common/hooks";
import { AddPlaylistVideoModal } from "@playlist/components";
import { IVideoCompact } from "@youtube/apis";
import { Accessor, JSX, ParentComponent, Setter, createContext, createSignal } from "solid-js";
import { ConfirmationModal, QuickSearchModal } from "./components";
import { useCatJam } from "./hooks";

type Confirmation = {
	title: string;
	message?: JSX.Element;
	isAlert?: boolean;
	onConfirm?: () => unknown | Promise<unknown>;
};

export type AppContextStore = {
	title: Accessor<string>;
	setTitle: (title: string) => void;
	setVideoPlaylist: (video: IVideoCompact | null) => void;
	setConfirmation: (confirmation: Confirmation | null) => void;
	setIsQuickSearchModalOpen: Setter<boolean>;
};

export const AppContext = createContext<AppContextStore>({
	title: () => "",
	setTitle: () => {},
	setVideoPlaylist: () => {},
	setConfirmation: () => {},
	setIsQuickSearchModalOpen: () => false as any,
});

export const AppProvider: ParentComponent = (props) => {
	useCatJam();

	const [title, setTitle] = createSignal("");
	const [videoPlaylist, setVideoPlaylist] = createSignal<null | IVideoCompact>(null);
	const [isQuickSearchModalOpen, setIsQuickSearchModalOpen] = createSignal(false);
	const [confirmation, setConfirmation] = createSignal<Confirmation | null>(null);

	const onConfirm = async () => {
		await confirmation()?.onConfirm?.();
		setConfirmation(null);
	};

	useShortcut({
		shortcuts: [
			{ key: "k", ctrl: true, handler: () => setIsQuickSearchModalOpen(true) },
			{ key: "p", handler: () => setIsQuickSearchModalOpen(true) },
		],
	});

	const store = {
		title,
		setTitle,
		setVideoPlaylist,
		setConfirmation,
		setIsQuickSearchModalOpen,
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
				onConfirm={onConfirm}
				onClose={() => setConfirmation(null)}
			/>
		</AppContext.Provider>
	);
};
