/* eslint-disable @typescript-eslint/no-explicit-any */
import { useShortcut } from "@common/hooks";
import { IMediaSource } from "@media-source/apis";
import { AddPlaylistMediaSourceModal } from "@playlist/components";
import { Accessor, JSX, ParentComponent, Setter, createContext, createSignal } from "solid-js";
import { ConfirmationModal, QuickSearchModal } from "./components";
import { useCatJam, useSnowfall, useVersionCheck, useZoom } from "./hooks";

type Confirmation = {
	title: string;
	message?: string | (() => JSX.Element);
	isAlert?: boolean;
	onConfirm?: () => unknown | Promise<unknown>;
};

export type AppContextStore = {
	title: Accessor<string>;
	setTitle: (title: string) => void;
	promptAddMediaToPlaylist: (media: IMediaSource | null) => void;
	setConfirmation: (confirmation: Confirmation | null) => void;
	setIsQuickSearchModalOpen: Setter<boolean>;
	hasNewVersion: Accessor<boolean>;
};

export const AppContext = createContext<AppContextStore>({
	title: () => "",
	setTitle: () => {},
	promptAddMediaToPlaylist: () => {},
	setConfirmation: () => {},
	setIsQuickSearchModalOpen: () => false,
	hasNewVersion: () => false,
});

export const AppProvider: ParentComponent = (props) => {
	useSnowfall();
	useCatJam();
	useZoom();
	const { hasNewVersion } = useVersionCheck();

	const [title, setTitle] = createSignal("");
	const [mediaPlaylist, setMediaPlaylist] = createSignal<null | IMediaSource>(null);
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
		promptAddMediaToPlaylist: setMediaPlaylist,
		setConfirmation,
		setIsQuickSearchModalOpen,
		hasNewVersion,
	};

	return (
		<AppContext.Provider value={store}>
			{props.children}

			<QuickSearchModal isOpen={isQuickSearchModalOpen()} onDone={() => setIsQuickSearchModalOpen(false)} />

			<AddPlaylistMediaSourceModal
				mediaSource={mediaPlaylist()}
				isOpen={!!mediaPlaylist()}
				onClose={() => setMediaPlaylist(null)}
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
