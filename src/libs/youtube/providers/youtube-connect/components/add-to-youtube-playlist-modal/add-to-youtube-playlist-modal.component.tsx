import { Modal } from "@common";
import { type IMediaSource } from "@media-source";
import { Show, type Component } from "solid-js";
import { ModalContent } from "./components";

type Props = {
	mediaSources: IMediaSource[] | null;
	isOpen: boolean;
	onClose: () => void;
};

export const AddToYouTubePlaylistModal: Component<Props> = (props) => {
	return (
		<Modal
			isOpen={props.isOpen}
			handleClose={props.onClose}
			extraContainerClass="w-xl max-h-[90vh] flex flex-col"
			closeOnEscape
		>
			<Show when={props.mediaSources} keyed>
				{(sources) => <ModalContent mediaSources={sources} onAdd={props.onClose} />}
			</Show>
		</Modal>
	);
};
