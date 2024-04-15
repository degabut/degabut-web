import { Button, Text } from "@common";
import { Show, type ParentComponent } from "solid-js";

type SectionProps = {
	id: string;
	nextId?: string;
	previousId?: string;
	title?: string;
};

export const Section: ParentComponent<SectionProps> = (props) => {
	const scrollIdIntoView = (id: string) => {
		const element = document.getElementById(id);
		if (!element) return;
		element.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<div id={props.id} class="relative h-[100dvh] snap-start">
			<div class="flex-col-center justify-center h-full space-y-12 pb-10">
				<Show when={props.title} keyed>
					{(title) => <Text.H1 class="text-4xl text-brand text-center">{title}</Text.H1>}
				</Show>
				<div class="flex-col-center w-full">{props.children}</div>
			</div>

			<div class="absolute bottom-10 flex flex-row justify-center space-x-4 w-full">
				<Button
					icon="arrowUp"
					iconSize="xl"
					rounded
					class="p-3"
					classList={{ invisible: !props.previousId }}
					onClick={() => props.previousId && scrollIdIntoView(props.previousId)}
				/>

				<Button
					icon="arrowDown"
					iconSize="xl"
					rounded
					class="p-3"
					classList={{ invisible: !props.nextId }}
					onClick={() => props.nextId && scrollIdIntoView(props.nextId)}
				/>
			</div>
		</div>
	);
};
