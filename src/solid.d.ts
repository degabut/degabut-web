import { ClickOutsideParams } from "@directives/clickOutside";
import { ResizableParams } from "@directives/resizable";
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
			resizable: ResizableParams;
		}
	}
}
