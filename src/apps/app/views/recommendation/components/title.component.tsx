import { Text } from "@common";
import { Show, type Accessor, type Component, type JSX, type ParentComponent } from "solid-js";
import { SeeMoreButton, SeeMoreTextButton } from "./see-more-button.component";

type TitleProps = {
	right?: Accessor<JSX.Element>;
};

export const Title: ParentComponent<TitleProps> = (props) => {
	return (
		<div class="flex flex-row justify-between items-end">
			<Text.H2 class="text-xl font-medium">{props.children}</Text.H2>
			{props.right?.()}
		</div>
	);
};

type LabelProps = {
	isLoading: boolean;
	onClickMore?: () => void;
	label: string;
	extraRight?: Accessor<JSX.Element>;
};

export const ShowMoreTitle: Component<LabelProps> = (props) => {
	return (
		<Title
			right={() => (
				<div class="flex flex-row items-center space-x-2">
					<Show when={!props.isLoading}>{props.extraRight?.()}</Show>
					<Show when={!props.isLoading && props.onClickMore}>
						<div class="hidden md:block">
							<SeeMoreTextButton onClick={() => props.onClickMore!()} />
						</div>
						<div class="md:hidden">
							<SeeMoreButton onClick={() => props.onClickMore!()} />
						</div>
					</Show>
				</div>
			)}
		>
			{props.label}
		</Title>
	);
};
