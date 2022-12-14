import { JSX, ParentComponent } from "solid-js";

type Props = JSX.AnchorHTMLAttributes<HTMLAnchorElement>;

export const A: ParentComponent<Props> = (props) => {
	return <a {...props}>{props.children}</a>;
};
