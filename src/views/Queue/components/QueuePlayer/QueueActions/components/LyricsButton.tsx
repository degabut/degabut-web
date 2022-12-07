import { Button } from "@components/Button";
import { Component } from "solid-js";

type Props = {
	onClick: () => void;
};

export const LyricsButton: Component<Props> = (props) => {
	return <Button flat icon="microphone" class="p-2" iconSize="lg" onClick={() => props.onClick()} title="Lyrics" />;
};
