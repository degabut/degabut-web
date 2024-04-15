import { A as SolidA, type AnchorProps } from "@solidjs/router";
import type { ParentComponent } from "solid-js";
import { UrlUtil, type PatchPathParams } from "../../utils";

type Props = { params?: PatchPathParams } & AnchorProps;

export const A: ParentComponent<Props> = (props) => {
	return (
		<SolidA {...props} href={UrlUtil.patchPath(props.href, props.params)}>
			{props.children}
		</SolidA>
	);
};
