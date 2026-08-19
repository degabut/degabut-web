import { Modal } from "@common";
import type { IMediaSource } from "@media-source";
import type { Component } from "solid-js";
import { ModalContent } from "./components";

type Props = {
	mediaSources: IMediaSource[] | null;
	isOpen: boolean;
	onClose: () => void;
};

export const AddPlaylistMediaSourceModal: Component<Props> = (props) => {
	return (
		<Modal
			extraContainerClass="absolute w-2xl h-[90vh] md:h-[70vh] overflow-auto"
			isOpen={props.isOpen}
			closeOnEscape
			handleClose={() => props.onClose()}
		>
			<ModalContent mediaSources={props.mediaSources} onAddToPlaylist={props.onClose} />
		</Modal>
	);
};
