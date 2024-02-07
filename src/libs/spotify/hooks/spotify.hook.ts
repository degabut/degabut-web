import { SpotifyContext } from "@spotify/providers";
import { useContext } from "solid-js";

export const useSpotify = () => useContext(SpotifyContext);
