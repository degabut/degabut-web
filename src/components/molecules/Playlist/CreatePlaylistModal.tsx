import { Button, Input, Modal } from "@components/atoms";
import { Component, createEffect, createSignal } from "solid-js";

type CreatePlaylistModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (name: string) => void;
};

export const CreatePlaylistModal: Component<CreatePlaylistModalProps> = (props) => {
	const [name, setName] = createSignal("");
	const [isSubmitting, setIsSubmitting] = createSignal(false);

	const submit = (e: Event) => {
		e.preventDefault();
		setIsSubmitting(true);
		props.onSubmit(name());
	};

	createEffect(() => {
		if (!props.isOpen) {
			setIsSubmitting(false);
			setName("");
		}
	});

	return (
		<Modal
			isOpen={props.isOpen}
			onClickOutside={() => props.onClose()}
			closeOnEscape
			extraContainerClass="w-[24rem] max-h-[100vh] m-2 bg-neutral-900"
		>
			<form class="flex-col-center space-y-8 md:p-8 p-4" onSubmit={submit}>
				<div class="text-center text-xl font-medium">Create a New Playlist</div>

				<Input
					outlined
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
						onClick={() => props.onClose()}
						class="px-8 py-1.5 underline underline-offset-2 hover:bg-white/0"
					>
						Cancel
					</Button>

					<Button class="px-4 py-1" type="submit" rounded disabled={isSubmitting() || !name()}>
						Create
					</Button>
				</div>
			</form>
		</Modal>
	);
};
