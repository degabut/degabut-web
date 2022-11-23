import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Modal } from "@components/Modal";
import { Component, createEffect, createSignal } from "solid-js";

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
			onClickOutside={() => props.onClose()}
			closeOnEscape
			extraContainerClass="w-[24rem] max-h-[100vh] m-2 bg-neutral-900"
		>
			<form class="flex-col-center space-y-8 md:p-8 p-4" onSubmit={submit}>
				<div class="text-center text-xl font-medium">Rename Playlist</div>

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
					<div class="underline underline-offset-2 cursor-pointer" onClick={() => props.onClose()}>
						Cancel
					</div>

					<Button type="submit" rounded disabled={isSubmitting() || !name()} class="px-8">
						Update
					</Button>
				</div>
			</form>
		</Modal>
	);
};
