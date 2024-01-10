import { ItemCard, ItemCardSkeleton } from "./item-card";
import { ItemHint } from "./item-hint";
import { ItemList, ItemListBig, ItemListBigSkeleton, ItemListSkeleton } from "./item-list";

export type { ItemCardProps } from "./item-card";
export type { ItemListProps } from "./item-list";

export const Item = {
	List: ItemList,
	ListSkeleton: ItemListSkeleton,

	ListBig: ItemListBig,
	ListBigSkeleton: ItemListBigSkeleton,

	Card: ItemCard,
	CardSkeleton: ItemCardSkeleton,

	Hint: ItemHint,
};
