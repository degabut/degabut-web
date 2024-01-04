import { Divider, Item, Modal, Text } from "@common/components";
import { DurationBadge } from "@media-source/components/media/components";
import { IChapter } from "@youtube/apis";
import { Component, For } from "solid-js";

type ChaptersModalProps = {
	isOpen: boolean;
	handleClose: () => void;
	chapters: IChapter[];
	position: number;
	onClickChapter: (chapter: IChapter) => void;
};

export const ChaptersModal: Component<ChaptersModalProps> = (props) => {
	return (
		<Modal
			extraContainerClass="w-[42rem] top-[15vh] h-[90vh] md:h-[70vh]"
			isOpen={props.isOpen}
			closeOnEscape
			onClickOutside={props.handleClose}
		>
			<div class="flex flex-col h-full">
				<div class="py-4 !pb-0">
					<Text.H2 class="text-center mb-4">Chapters</Text.H2>
					<Divider />
				</div>
				<div class="pb-8 pt-4 px-2 md:px-8 overflow-auto space-y-2">
					<For each={props.chapters}>
						{(c, i) => (
							<Item.List
								title={c.title}
								imageUrl={c.thumbnails[0].url}
								extraTitleClass={
									props.position >= c.start &&
									(props.chapters.at(i() + 1)
										? props.position < props.chapters[i() + 1]?.start
										: true)
										? "text-brand-600"
										: ""
								}
								onClick={() => props.onClickChapter(c)}
								extra={() => <DurationBadge duration={c.start / 1000} />}
							/>
						)}
					</For>
				</div>
			</div>
		</Modal>
	);
};
