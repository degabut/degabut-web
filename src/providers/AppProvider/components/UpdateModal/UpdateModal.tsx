import { Button } from "@components/Button";
import { Modal } from "@components/Modal";
import { Text } from "@components/Text";
import { IS_DESKTOP } from "@constants";
import { Component, createSignal, onMount, Show } from "solid-js";

export const UpdateModal: Component = () => {
	const [isShowUpdateModal, setIsShowUpdateModal] = createSignal(false);

	onMount(() => {
		if (IS_DESKTOP) {
			// TODO handle update
		}
	});

	return (
		<Show when={IS_DESKTOP}>
			{/* Update Modal */}
			<Modal
				extraContainerClass="w-[24rem] bg-neutral-900"
				isOpen={isShowUpdateModal()}
				onClickOutside={() => setIsShowUpdateModal(false)}
			>
				<div class="flex-col-center text-center space-y-8 md:p-8 p-4">
					<Text.H1>New Update Found</Text.H1>
					<Text.Body1>Restart Degabut to apply update</Text.Body1>

					<Button class="px-8 py-1.5" rounded onClick={() => setIsShowUpdateModal(false)}>
						OK
					</Button>
				</div>
			</Modal>
		</Show>
	);
};
