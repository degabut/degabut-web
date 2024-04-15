/* eslint-disable @typescript-eslint/no-explicit-any */
import { useShortcut } from "@common";
import type { IMediaSource } from "@media-source";
import { AddPlaylistMediaSourceModal } from "@playlist";
import {
	Show,
	createContext,
	createSignal,
	type Accessor,
	type JSX,
	type ParentComponent,
	type Setter,
} from "solid-js";
import type { SetStoreFunction } from "solid-js/store";
import { ConfirmationModal, ExternalTrackAdder, QuickSearchModal } from "./components";
import { useAppRichPresence, useCatJam, useQueueNotification, useSnowfall, useVersionCheck, useZoom } from "./hooks";

type Confirmation<T = object> = {
	title: string;
	message?: string | ((state: T, setState: SetStoreFunction<T>) => JSX.Element);
	isAlert?: boolean;
	state?: T;
	onConfirm?: (state: T) => unknown | Promise<unknown>;
};

export type AppContextStore = {
	title: Accessor<string>;
	setTitle: (title: string) => void;
	promptAddMediaToPlaylist: (media: IMediaSource | null) => void;
	setConfirmation: <T>(confirmation: Confirmation<T> | null) => void;
	setIsQuickSearchModalOpen: Setter<boolean>;
	hasNewVersion: Accessor<boolean>;
};

export const AppContext = createContext<AppContextStore>({} as AppContextStore);

export const AppProvider: ParentComponent = (props) => {
	useSnowfall();
	useCatJam();
	useZoom();
	useQueueNotification();
	useAppRichPresence();
	const { hasNewVersion } = useVersionCheck();

	const [title, setTitle] = createSignal("");
	const [mediaPlaylist, setMediaPlaylist] = createSignal<null | IMediaSource>(null);
	const [isQuickSearchModalOpen, setIsQuickSearchModalOpen] = createSignal(false);
	const [confirmation, setConfirmation] = createSignal<Confirmation | null>(null);

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

			<ExternalTrackAdder />

			<QuickSearchModal isOpen={isQuickSearchModalOpen()} onDone={() => setIsQuickSearchModalOpen(false)} />

			<AddPlaylistMediaSourceModal
				mediaSource={mediaPlaylist()}
				isOpen={!!mediaPlaylist()}
				onClose={() => setMediaPlaylist(null)}
			/>

			<Show when={confirmation()} keyed>
				{(c) => (
					<ConfirmationModal
						title={c.title || ""}
						message={c.message}
						isAlert={!!c.isAlert}
						onConfirm={(state) => {
							c.onConfirm?.(state);
							setConfirmation(null);
						}}
						initialState={c.state}
						onClose={() => setConfirmation(null)}
					/>
				)}
			</Show>
		</AppContext.Provider>
	);
};
