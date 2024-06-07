import { Item, Text } from "@common";
import type { Component } from "solid-js";

type Props = {
	onClick: () => void;
};

export const CreatePlaylistButton: Component<Props> = (props) => {
	return <Item.Hint icon="plus" label={() => <Text.Body1>Create New Playlist</Text.Body1>} onClick={props.onClick} />;
};
