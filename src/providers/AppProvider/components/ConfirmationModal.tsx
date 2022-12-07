import { Button } from "@components/Button";
import { Modal } from "@components/Modal";
import { Component, createSignal, JSX, onCleanup, onMount, Show } from "solid-js";

type Props = {
	title: JSX.Element;
	message?: JSX.Element;
	isAlert: boolean;
	isOpen: boolean;
	onConfirm: () => void | Promise<void>;
	onClose: () => void;
};

export const ConfirmationModal: Component<Props> = (props) => {
	const [isLoading, setIsLoading] = createSignal(false);

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter") props.onConfirm();
	};

	const onConfirm = async () => {
		setIsLoading(true);
		await props.onConfirm();
		setIsLoading(false);
	};

	onMount(() => {
		document.addEventListener("keydown", onKeyDown);
	});

	onCleanup(() => {
		document.removeEventListener("keydown", onKeyDown);
	});

	return (
		<Modal
			extraContainerClass="absolute bg-neutral-900 w-[32rem] max-h-[70vh] break-words"
			isOpen={props.isOpen}
			closeOnEscape
			onClickOutside={() => props.onClose()}
		>
			<div class="space-y-8 p-8">
				<div class="text-xl font-medium text-center mb-4">{props.title}</div>
				<div class="text-center">{props.message}</div>

				<div class="flex-row-center justify-evenly w-full">
					<Show when={!props.isAlert}>
						<Button
							flat
							class="px-8 py-1.5 underline underline-offset-2 hover:bg-white/0"
							onClick={() => props.onClose()}
						>
							Cancel
						</Button>
					</Show>

					<Button type="submit" rounded disabled={isLoading()} onClick={onConfirm} class="px-8 py-1.5">
						{props.isAlert ? "Ok" : "Confirm"}
					</Button>
				</div>
			</div>
		</Modal>
	);
};
