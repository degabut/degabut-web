import { Button, Modal, useShortcut } from "@common";
import { Show, createSignal, type Component, type JSX } from "solid-js";
import { createStore, type SetStoreFunction } from "solid-js/store";

type Props = {
	title: string;
	message?: string | ((state: object, setState: SetStoreFunction<object>) => JSX.Element);
	initialState?: object;
	isAlert: boolean;
	onConfirm: (state: object) => void | Promise<void>;
	onClose: () => void;
};

export const ConfirmationModal: Component<Props> = (props) => {
	const [isLoading, setIsLoading] = createSignal(false);
	const [state, setState] = createStore<object>(props.initialState);

	useShortcut({
		shortcuts: [{ key: "Enter", handler: () => onConfirm() }],
	});

	const onConfirm = async () => {
		setIsLoading(true);
		await props.onConfirm(state);
		setIsLoading(false);
	};

	return (
		<Modal
			extraContainerClass="absolute w-[32rem] max-h-[70vh] break-words"
			isOpen
			closeOnEscape
			handleClose={() => props.onClose()}
		>
			<div class="space-y-8 p-8">
				<div class="text-xl font-medium text-center mb-4">{props.title}</div>

				{typeof props.message === "string" ? (
					<div class="text-center">{props.message}</div>
				) : (
					props.message?.(state, setState)
				)}

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
