import { LoopToggleButton } from "./loop-toggle-button.component";
import { LyricsButton } from "./lyrics-button.component";
import { OptionsButton } from "./options-button.component";
import { PlayButton } from "./play-button.component";
import { ShuffleToggleButton } from "./shuffle-toggle-button.component";
import { SkipNextButton } from "./skip-next-button.component";
import { SkipPreviousButton } from "./skip-previous.component";

export const QueueButton = {
	Lyrics: LyricsButton,
	Play: PlayButton,
	Options: OptionsButton,
	SkipPrevious: SkipPreviousButton,
	SkipNext: SkipNextButton,
	LoopToggle: LoopToggleButton,
	ShuffleToggle: ShuffleToggleButton,
};
