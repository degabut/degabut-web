import { LoopToggleButton } from "./loop-toggle-button.component";
import { LyricsButton } from "./lyrics-button.component";
import { PlayButton } from "./play-button.component";
import { SettingsButton } from "./settings-button.component";
import { ShuffleToggleButton } from "./shuffle-toggle-button.component";
import { SkipButton } from "./skip-button.component";

export const QueueButton = {
	Lyrics: LyricsButton,
	Play: PlayButton,
	Settings: SettingsButton,
	Skip: SkipButton,
	LoopToggle: LoopToggleButton,
	ShuffleToggle: ShuffleToggleButton,
};
