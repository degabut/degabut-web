import { Icon } from "@components/Icon";
import { Input } from "@components/Input";
import { debounce } from "@utils/debounce";
import { Component } from "solid-js";

type Props = {
	keyword: string;
	onInput: (keyword: string) => void;
};

export const SearchInput: Component<Props> = (props) => {
	const debouncedInput = debounce((v: string) => {
		props.onInput(v);
	}, 350);

	return (
		<Input
			dense
			outlined
			value={props.keyword}
			onInput={(e) => debouncedInput(e.currentTarget.value)}
			onKeyDown={(e) => {
				if (e.key !== "Escape") return;
				props.onInput("");
				e.currentTarget.blur();
			}}
			prefix={
				<Icon
					name={props.keyword ? "closeLine" : "search"}
					size="md"
					extraClass="fill-neutral-300"
					onClick={() => props.onInput("")}
					extraClassList={{ "cursor-pointer": !!props.keyword }}
				/>
			}
			class="text-sm bg-neutral-400/10 grow w-full md:max-w-[16rem] !border-neutral-500"
		/>
	);
};
