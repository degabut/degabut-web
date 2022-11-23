import { Button } from "@components/Button";
import { Modal } from "@components/Modal";
import * as runtime from "@runtime";
import { Component, createSignal, onMount, Show } from "solid-js";
import { IS_DESKTOP } from "../../../constants";

export const UpdateModal: Component = () => {
	const [isShowUpdateModal, setIsShowUpdateModal] = createSignal(false);

	onMount(() => {
		if (IS_DESKTOP) {
			runtime.EventsOn("update", () => {
				setIsShowUpdateModal(true);
			});
		}
	});

	return (
		<Show when={IS_DESKTOP}>
			{/* Update Modal */}
			<Modal
				extraContainerClass="w-[24rem] max-h-[100vh] bg-neutral-900"
				isOpen={isShowUpdateModal()}
				onClickOutside={() => setIsShowUpdateModal(false)}
			>
				<div class="flex-col-center space-y-8 md:p-8 p-4">
					<div class="text-center text-2xl font-medium">New Update Found</div>
					<div class="text-center mt-8">Restart Degabut to apply update</div>

					<Button rounded onClick={() => setIsShowUpdateModal(false)}>
						OK
					</Button>
				</div>
			</Modal>
		</Show>
	);
};
