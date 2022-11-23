import { JSX, ParentComponent } from "solid-js";

type Props = JSX.AnchorHTMLAttributes<HTMLAnchorElement>;

export const Link: ParentComponent<Props> = (props) => {
	return <a {...props}>{props.children}</a>;
};
