import "solid-js";
import { ClickOutsideParams } from "./directives";
import { ContextMenuDirectiveParams } from "./providers";

declare module "solid-js" {
	namespace JSX {
		interface Directives {
			sortable: boolean;
			clickOutside: ClickOutsideParams;
			doubleClick: () => void;
			contextMenu: ContextMenuDirectiveParams;
			buttonContextMenu: ContextMenuDirectiveParams;
		}
	}
}
