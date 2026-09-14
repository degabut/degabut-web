import { useNotification } from "@common";
import {
	createContext,
	createEffect,
	createSignal,
	onCleanup,
	useContext,
	type Accessor,
	type ParentComponent,
} from "solid-js";
import { type IMediaSource } from "../../apis";
import { MediaSourceSelectionBar } from "../../components";
import { useMediaSourceSelectionMenu } from "../../hooks/selection-menu.hook";

const MAX_SELECTED = 100;

export type MediaSourceSelectStore = {
	ids: Accessor<Record<string, IMediaSource | undefined>>;
	hasSelection: Accessor<boolean>;
	isSelectionMode: Accessor<boolean>;
	startSelection: (mediaSource: IMediaSource) => void;
	toggle: (mediaSource: IMediaSource) => void;
	clear: () => void;
};

export const MediaSourceSelectContext = createContext<MediaSourceSelectStore | undefined>(undefined);

type SelectionBarHostProps = {
	selection: MediaSourceSelectStore;
};

const SelectionNotification: ParentComponent<SelectionBarHostProps> = (props) => {
	const notification = useNotification();
	const selectionMenu = useMediaSourceSelectionMenu(props.selection);
	let persistentNotification: ReturnType<typeof notification.createPersistent> | null = null;

	createEffect(() => {
		if (props.selection.hasSelection() && !persistentNotification) {
			persistentNotification = notification.createPersistent();
			persistentNotification.setJsx(() => (
				<MediaSourceSelectionBar selection={props.selection} onMenuItems={selectionMenu} />
			));
			persistentNotification.show();
		} else if (!props.selection.hasSelection() && persistentNotification) {
			persistentNotification.destroy();
			persistentNotification = null;
		}
	});

	onCleanup(() => persistentNotification?.destroy());

	return props.children;
};

export const MediaSourceSelectProvider: ParentComponent = (props) => {
	const [ids, setIds] = createSignal<Record<string, IMediaSource | undefined>>({});
	const [selectionMode, setSelectionMode] = createSignal(false);

	const hasSelection = () => !!Object.keys(ids() ?? {}).length;
	const isSelectionMode = () => selectionMode() && hasSelection();

	const toggle = (mediaSource: IMediaSource) => {
		setIds((prev) => {
			const next = { ...prev };
			if (next[mediaSource.id]) delete next[mediaSource.id];
			else if (Object.keys(next).length < MAX_SELECTED) next[mediaSource.id] = mediaSource;
			return next;
		});
	};

	const startSelection = (mediaSource: IMediaSource) => {
		setSelectionMode(true);
		if (!ids()[mediaSource.id]) toggle(mediaSource);
	};

	const clear = () => {
		setSelectionMode(false);
		setIds({});
	};

	const store: MediaSourceSelectStore = { ids, hasSelection, isSelectionMode, startSelection, toggle, clear };

	return (
		<MediaSourceSelectContext.Provider value={store}>
			{props.children}

			<SelectionNotification selection={store} />
		</MediaSourceSelectContext.Provider>
	);
};

export const useMediaSourceSelect = () => useContext(MediaSourceSelectContext);
