import { A, Container, Text } from "@common";
import type { Component } from "solid-js";

export const Error: Component<{ error: unknown }> = (props) => {
	const copyToClipboard = () => navigator.clipboard.writeText(props.error as string);

	// eslint-disable-next-line solid/reactivity
	console.error(props.error);
	return (
		<Container
			size="full"
			extraClass="flex flex-col justify-center h-full bg-gradient-to-b from-neutral-800 to-neutral-900"
		>
			<div>
				<Text.H1 class="text-9xl">:(</Text.H1>

				<div class="flex flex-col text-xl pt-16 space-y-4">
					<Text.H3>Something went wrong, check console for error details.</Text.H3>

					<A class="underline underline-offset-2" href="/">
						<Text.Body1>Go back</Text.Body1>
					</A>

					<Text.Caption2 class="hover:underline underline-offset-2 cursor-pointer" onClick={copyToClipboard}>
						Copy Error to Clipboard
					</Text.Caption2>
				</div>
			</div>
		</Container>
	);
};
