import { Item } from "@common";
import type { Component } from "solid-js";

type Props = {
	onClick: () => void;
};

export const CreatePlaylistButton: Component<Props> = (props) => {
	return <Item.Hint icon="plus" label="Create new playlist" onClick={props.onClick} />;
};
