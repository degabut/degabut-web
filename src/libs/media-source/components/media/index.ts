import { MediaSourceCard } from "./card.component";
import { MediaSourceList, MediaSourceListBig, MediaSourceListResponsive } from "./list.component";

export * from "./card.component";
export * from "./components";
export * from "./list.component";

export const MediaSource = {
	List: MediaSourceList,
	ListBig: MediaSourceListBig,
	ListResponsive: MediaSourceListResponsive,
	Card: MediaSourceCard,
};
