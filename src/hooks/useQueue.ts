import { QueueContext } from "@providers/QueueProvider";
import { useContext } from "solid-js";

export const useQueue = () => useContext(QueueContext);
