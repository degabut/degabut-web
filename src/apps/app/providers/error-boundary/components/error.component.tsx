import { A, Text } from "@common";
import type { Component } from "solid-js";

export const Error: Component<{ error: unknown }> = (props) => {
	const copyToClipboard = () => navigator.clipboard.writeText(props.error as string);
	const reload = (e: Event) => {
		e.preventDefault();
		location.reload();
	};

	// eslint-disable-next-line solid/reactivity
	console.error(props.error);
	return (
		<div class="w-screen h-full p-8 flex flex-col justify-center bg-neutral-900">
			<div>
				<Text.H1 class="text-9xl">:(</Text.H1>

				<div class="flex flex-col text-xl pt-16 space-y-4">
					<Text.H3>Something went wrong, check console for error details.</Text.H3>

					<div class="flex-row-center space-x-6">
						<A class="underline underline-offset-2" href="/">
							<Text.Body1>Go back</Text.Body1>
						</A>
						<A class="underline underline-offset-2" href="#" onClick={reload}>
							<Text.Body1>Reload</Text.Body1>
						</A>
					</div>

					<Text.Caption2 class="hover:underline underline-offset-2 cursor-pointer" onClick={copyToClipboard}>
						Copy Error to Clipboard
					</Text.Caption2>
				</div>
			</div>
		</div>
	);
};
