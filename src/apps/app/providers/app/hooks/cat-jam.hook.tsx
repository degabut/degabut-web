import { DelayUtil, useShortcut } from "@common";
import { useQueue, type IGuildMember, type IJam, type IJamCollection } from "@queue";
import { createEffect, onMount, type Accessor, type Component } from "solid-js";
import { render } from "solid-js/web";

type CatJamProps = {
	member: IGuildMember;
} & IJam;

const CatJam: Component<CatJamProps> = (props) => {
	let element!: HTMLDivElement;
	const x = () => Math.round(props.xOffset * 100);
	const url = () =>
		props.jamSpeed < 0.65
			? "/img/cat-jam-slow.gif"
			: props.jamSpeed < 0.8
			? "/img/cat-jiggy.gif"
			: props.jamSpeed < 0.95
			? "/img/cat-jam-fast.gif"
			: props.jamSpeed < 0.99
			? "/img/cat-jam-rainbow.gif"
			: "/img/cat-jam-super-fast.gif";

	onMount(() => {
		const screenHeight = window.innerHeight;

		setTimeout(() => {
			element.style.transform = `translate(${x()}vw, -${screenHeight * 2}px)`;
		}, 50);

		setTimeout(() => {
			element.style.opacity = "0";
		}, 3000);
	});

	return (
		<div
			ref={element}
			class="flex flex-col space-y-0.5"
			style={{
				transform: `translate(${x()}vw, 0px)`,
				transition: `opacity 3s linear, transform ${Math.round(18000 - props.ySpeed * 12000)}ms linear`,
			}}
		>
			<img src={url()} class="w-10 h-10 md:w-16 md:h-16 mx-auto" />
			<div class="flex-row-center space-x-0.5">
				<img src={props.member.avatar || "/img/avatar.png"} class="w-4 h-4 rounded-full" />
				<div class="text-sm">{props.member.displayName}</div>
			</div>
		</div>
	);
};

type Params = {
	enabled: Accessor<boolean>;
};

export const useCatJam = (params: Params) => {
	const { emitter, jam } = useQueue()!;

	const throttledJam = DelayUtil.countedThrottle(jam, 350);
	useShortcut({
		shortcuts: [
			{
				key: "j",
				handler: () => {
					if (params.enabled()) throttledJam();
				},
			},
		],
	});

	createEffect(() => {
		if (params.enabled()) emitter.on("member-jammed", onJam);
		else emitter.removeListener("member-jammed", onJam);
	});

	const onJam = async (collection: IJamCollection) => {
		const length = collection.jams.length;
		for (const j of collection.jams) {
			spawnJam({ ...j, member: collection.member });
			await new Promise((r) => setTimeout(r, 350 / length));
		}
	};

	const spawnJam = (jam: CatJamProps) => {
		const element = document.createElement("div");
		element.className = "fixed pointer-events-none z-50";
		render(() => <CatJam {...jam} />, element);
		document.body.appendChild(element);
		setTimeout(() => element.remove(), 6000);
	};
};
