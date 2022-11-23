import { ApiContext } from "@providers/ApiProvider";
import { useContext } from "solid-js";

export const useApi = () => useContext(ApiContext);
