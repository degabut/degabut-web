import { useContext } from "solid-js";
import { NotificationContext } from "../NotificationProvider";

export const useNotification = () => useContext(NotificationContext);
