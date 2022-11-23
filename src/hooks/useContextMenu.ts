import { ContextMenuContext } from "@providers/ContextMenuProvider";
import { useContext } from "solid-js";

export const useContextMenu = () => useContext(ContextMenuContext);
