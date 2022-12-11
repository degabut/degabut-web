import { IS_DESKTOP } from "@constants";
import * as runtime from "@runtime";
import { JSX, ParentComponent } from "solid-js";

type Props = JSX.AnchorHTMLAttributes<HTMLAnchorElement>;

export const A: ParentComponent<Props> = (props) => {
	const onClick = (e: MouseEvent) => {
		if (IS_DESKTOP) {
			e.preventDefault();
			if (props.href) runtime.BrowserOpenURL(props.href);
		}
	};

	return (
		<a {...props} onClick={onClick}>
			{props.children}
		</a>
	);
};
