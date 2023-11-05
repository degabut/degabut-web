import { ContextMenuContext } from "@common/providers";
import { useContext } from "solid-js";

export const useContextMenu = () => useContext(ContextMenuContext);
