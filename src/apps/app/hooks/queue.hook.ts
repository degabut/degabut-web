import { QueueContext } from "@queue/providers";
import { useContext } from "solid-js";

export const useQueue = () => useContext(QueueContext);
