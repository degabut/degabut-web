import type { ClickOutsideParams, ContextMenuDirectiveParams, ResizableParams } from "@common";
import "solid-js";

declare module "solid-js" {
	namespace JSX {
		interface Directives {
			sortable: boolean;
			clickOutside: ClickOutsideParams;
			contextMenu: ContextMenuDirectiveParams;
			buttonContextMenu: ContextMenuDirectiveParams;
			resizable: ResizableParams;
		}

		interface CustomEvents {
			click: MouseEvent;
		}
	}
}
