import { Button, Item, Text } from "@common/components";
import { useScreen } from "@common/hooks";
import { TimeUtil } from "@common/utils";
import { YT_IMAGE_PROXY } from "@constants";
import { IRecap } from "@user/apis";
import DomToImage from "dom-to-image";
import { Component, For, Show, createSignal } from "solid-js";

type OverviewDataProps = {
	label: string;
	value: string | number;
};

const OverviewData: Component<OverviewDataProps> = (props) => (
	<div class="text-center">
		<Text.H1 class="text-brand">{props.label}</Text.H1>
		<Text.H2 class="font-light truncate">{props.value}</Text.H2>
	</div>
);

type OverviewSectionProps = {
	recap: IRecap;
	year: number;
};

export const OverviewSection: Component<OverviewSectionProps> = (props) => {
	let cardRef!: HTMLDivElement;
	let image: string;

	const screen = useScreen();
	const [isSaving, setIsSaving] = createSignal(false);

	const scale = () => {
		const width = screen.size;
		if (width >= 1024) return 1;
		return width / (1024 + 16);
	};

	const peakMonth = () => [...props.recap.monthly].sort((a, b) => b.songPlayed - a.songPlayed)[0];

	const save = async () => {
		setIsSaving(true);
		const targetWidth = 2048;
		const cardRect = cardRef.getBoundingClientRect();
		const toScale = targetWidth / cardRect.width;

		if (!image) {
			image = await DomToImage.toPng(cardRef, {
				width: 2048,
				height: cardRect.height * toScale,
				style: {
					transform: "scale(2)",
					transformOrigin: "top left",
					borderWidth: "0",
					borderRadius: "0",
				},
			});
		}

		const link = document.createElement("a");
		link.download = `degabut-${props.year}-recap.png`;
		link.href = image;
		link.click();
		link.remove();
		setIsSaving(false);
	};

	return (
		<div class="flex-col-center space-y-6">
			<div
				ref={cardRef}
				class="relative w-[1024px] bg-neutral-850 py-8 px-12 overflow-hidden space-y-6 border border-neutral-700 rounded"
				style={{ transform: `scale(${scale()})` }}
			>
				<Text.H1 class="text-center text-brand text-3xl">
					Degabut<span class="text-gray-100"> {props.year} </span>Recap
				</Text.H1>

				<div class="flex flex-row w-full">
					<div class="flex flex-col w-full truncate">
						<Text.H1 class="mb-2 text-brand">Top Songs</Text.H1>
						<For each={props.recap.mostPlayed}>
							{({ video, count }, i) => {
								let imageUrl = video.thumbnails.at(0)!.url;
								if (YT_IMAGE_PROXY) imageUrl = YT_IMAGE_PROXY + new URL(imageUrl).pathname;

								return (
									<div class="flex-row-center space-x-2 w-full truncate">
										<div class="w-4">
											<Text.H2>{i() + 1}</Text.H2>
										</div>
										<div class="truncate w-full">
											<Item.List
												imageUrl={imageUrl}
												title={video.title}
												extra={() => (
													<Text.Caption1>
														Played {count} times - {video.channel?.name}
													</Text.Caption1>
												)}
											/>
										</div>
									</div>
								);
							}}
						</For>
					</div>

					<div class="flex flex-col w-2/3 justify-around">
						<OverviewData label="Song Played" value={props.recap.songPlayed} />
						<OverviewData
							label="Listened for"
							value={`${Math.floor(props.recap.durationPlayed / 60)} mins`}
						/>
						<OverviewData label="Peak Month" value={TimeUtil.getMonths(peakMonth().month)} />
					</div>
				</div>

				<img
					class="rounded-full opacity-10 absolute -right-12 -bottom-12 w-72"
					src="/android-chrome-512x512.png"
				/>
			</div>

			<Show when={YT_IMAGE_PROXY}>
				<Button icon="download" disabled={isSaving()} rounded class="pl-6 pr-7 py-1.5 space-x-2" onClick={save}>
					Save
				</Button>
			</Show>
		</div>
	);
};
