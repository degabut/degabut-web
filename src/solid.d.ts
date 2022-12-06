import { ClickOutsideParams } from "@directives/clickOutside";
import { ResizeableParams } from "@directives/resizeable";
import { ContextMenuDirectiveParams } from "@providers/ContextMenuProvider";
import "solid-js";

declare module "solid-js" {
	namespace JSX {
		interface Directives {
			sortable: boolean;
			clickOutside: ClickOutsideParams;
			doubleClick: () => void;
			contextMenu: ContextMenuDirectiveParams;
			buttonContextMenu: ContextMenuDirectiveParams;
			resizeable: ResizeableParams;
		}
	}
}
