import { ClickOutsideParams, ContextMenuDirectiveParams, ResizableParams } from "@common/directives";
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
