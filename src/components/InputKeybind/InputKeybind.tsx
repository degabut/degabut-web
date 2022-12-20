import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Text } from "@components/Text";
import { Component, createSignal, JSX, onCleanup } from "solid-js";

type Props = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
	value: string[];
	onChange: (value: string[]) => void;
};

export const InputKeybind: Component<Props> = (props) => {
	let input!: HTMLInputElement;
	const [isRecording, setIsRecording] = createSignal(false);
	const keys: Set<string> = new Set();

	const startRecording = () => {
		if (isRecording()) return;
		input.focus();
		document.addEventListener("keydown", onKeyDown);
		document.addEventListener("keyup", onKeyUp);
		setIsRecording(true);
	};

	const stopRecording = () => {
		input.blur();
		keys.clear();
		document.removeEventListener("keydown", onKeyDown);
		document.removeEventListener("keyup", onKeyUp);
		setIsRecording(false);
	};

	onCleanup(() => {
		document.removeEventListener("keydown", onKeyDown);
		document.removeEventListener("keyup", onKeyUp);
	});

	const onKeyDown = (e: KeyboardEvent) => {
		keys.add(e.key);
	};

	const onKeyUp = () => {
		props.onChange([...keys.values()].slice(0, +(props.maxLength || 4)));
		setIsRecording(false);
	};

	const formattedValue = () => {
		return props.value
			.map((v) => {
				if (v.match(/^[a-z]$/)) v = v.toUpperCase();
				if (v === "Control") v = "Ctrl";
				return v;
			})
			.join("+");
	};

	const label = () => {
		if (isRecording()) return "Stop";
		if (formattedValue()) return "Edit";
		else return "Record";
	};

	return (
		<Input
			ref={input}
			dense
			{...props}
			onChange={undefined}
			outlined
			readonly
			class="!bg-transparent text-sm"
			classList={{
				"border-red-500": isRecording(),
				[props.class || ""]: !!props.class,
				...props.classList,
			}}
			value={formattedValue()}
			onClick={startRecording}
			suffix={
				<Button
					class="px-1.5"
					classList={{ "border-red-500": isRecording() }}
					onClick={!isRecording() ? startRecording : stopRecording}
				>
					<Text.Caption1 classList={{ "text-red-500": isRecording() }}>{label()} </Text.Caption1>
				</Button>
			}
		/>
	);
};
