import type { Component } from "solid-js";
import "../item/item.css";

type Props = {
	text: string;
	size?: AbbreviationIconSize;
	extraClass?: string;
	extraClassList?: Record<string, boolean | undefined>;
};

type AbbreviationIconSize = "md" | "xl";

export const AbbreviationIcon: Component<Props> = (props) => {
	const shortName = () =>
		props.text
			.split(" ")
			.map((word) => word[0])
			.join("")
			.slice(0, 3);

	const size = () => props.size || "md";

	return (
		<div
			class="flex-col-center justify-center border border-neutral-600 rounded"
			classList={{
				"item-image": size() === "md",
				"text-2xl": size() === "md" && shortName().length === 1,
				"text-xl": size() === "md" && shortName().length === 2,
				"text-md": size() === "md" && shortName().length === 3,

				"w-24 h-24 md:w-32 md:h-32": size() === "xl",
				"text-5xl": size() === "xl" && shortName().length === 1,
				"text-4xl": size() === "xl" && shortName().length === 2,
				"text-3xl": size() === "xl" && shortName().length === 3,
			}}
		>
			{shortName()}
		</div>
	);
};
