import { IS_DESKTOP } from "@constants";
import { JSX, ParentComponent } from "solid-js";

type Props = JSX.AnchorHTMLAttributes<HTMLAnchorElement>;

export const A: ParentComponent<Props> = (props) => {
	return (
		<a {...props} target={IS_DESKTOP ? "_blank" : undefined}>
			{props.children}
		</a>
	);
};
