import { Button, Input, Modal, Text } from "@common";
import { createEffect, createSignal, type Component } from "solid-js";

type EditPlaylistModalProps = {
	isOpen: boolean;
	defaultName: string;
	onClose: () => void;
	onSubmit: (name: string) => void;
};

export const EditPlaylistModal: Component<EditPlaylistModalProps> = (props) => {
	const [name, setName] = createSignal(props.defaultName);
	const [isSubmitting, setIsSubmitting] = createSignal(false);

	createEffect(() => {
		setName(props.defaultName);
		if (!props.isOpen) setIsSubmitting(false);
	});

	const submit = (e: Event) => {
		e.preventDefault();
		setIsSubmitting(true);
		props.onSubmit(name());
	};

	return (
		<Modal
			isOpen={props.isOpen}
			handleClose={() => props.onClose()}
			closeOnEscape
			extraContainerClass="w-[24rem] max-h-[100vh] m-2"
		>
			<form class="flex-col-center space-y-8 md:p-8 p-4" onSubmit={submit}>
				<Text.H2 class="text-center">Rename Playlist</Text.H2>

				<Input
					rounded
					value={name()}
					onInput={(e) => setName(e.currentTarget.value)}
					focusOnMount
					minLength={1}
					maxLength={50}
					class="w-full"
					placeholder="Playlist Name"
				/>

				<div class="flex-row-center justify-evenly w-full">
					<Button
						flat
						rounded
						class="px-8 py-1.5 underline underline-offset-2 hover:bg-white/0"
						onClick={() => props.onClose()}
					>
						Cancel
					</Button>

					<Button type="submit" rounded disabled={isSubmitting() || !name()} class="px-8 py-1.5">
						Update
					</Button>
				</div>
			</form>
		</Modal>
	);
};
