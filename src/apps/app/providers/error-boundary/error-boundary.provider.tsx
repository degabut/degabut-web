import { ErrorBoundary, type ParentComponent } from "solid-js";
import { Error } from "./components";

export const ErrorBoundaryProvider: ParentComponent = (props) => {
	return <ErrorBoundary fallback={(err) => <Error error={err} />}>{props.children}</ErrorBoundary>;
};
