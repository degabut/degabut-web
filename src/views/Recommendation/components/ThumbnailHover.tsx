import { Button } from "@components/Button";
import { ContextMenuButton } from "@components/ContextMenu";
import { Divider } from "@components/Divider";
import { Icons } from "@components/Icon";
import { ContextMenuDirectiveParams } from "@providers/ContextMenuProvider";
import { Component, createSignal, Show } from "solid-js";

type ActionButtonProps = {
	title: string;
	icon: Icons;
	disabled?: boolean;
	onClick: () => Promise<void>;
};

const ActionButton: Component<ActionButtonProps> = (props) => {
	const [isLoading, setIsLoading] = createSignal(false);

	return (
		<Button
			rounded
			flat
			title={props.title}
			disabled={isLoading() || props.disabled}
			class="p-2.5"
			classList={{
				"bg-brand-900 text-black": isLoading() || props.disabled,
				"bg-brand-600 hover:bg-brand-400 text-neutral-800 hover:text-black": !isLoading() && !props.disabled,
			}}
			icon={props.icon}
			onClick={async (e) => {
				e.stopPropagation();
				setIsLoading(true);
				await props.onClick?.();
				setIsLoading(false);
			}}
		/>
	);
};

type Props = {
	contextMenu: ContextMenuDirectiveParams;
	showAddButtons: boolean;
	inQueue: boolean;
	isPlaying: boolean;
	onAddToQueue: () => Promise<void>;
	onPlay: () => Promise<void>;
};

export const ThumbnailHover: Component<Props> = (props) => {
	return (
		<div class="hidden md:block">
			<div class="absolute hover:bg-black/25 opacity-0 hover:opacity-100 transition rounded-md w-full h-full">
				<div class="absolute top-0 right-0">
					<ContextMenuButton contextMenu={props.contextMenu} />
				</div>

				<Show when={props.showAddButtons}>
					<div class="absolute bottom-2.5 right-2.5 flex-row-center space-x-1">
						<ActionButton
							title="Add to Queue"
							icon="plus"
							disabled={props.inQueue}
							onClick={() => props.onAddToQueue?.()}
						/>
						<Divider vertical dark />
						<ActionButton
							title="Play"
							icon="play"
							disabled={props.isPlaying}
							onClick={() => props.onPlay()}
						/>
					</div>
				</Show>
			</div>
		</div>
	);
};
