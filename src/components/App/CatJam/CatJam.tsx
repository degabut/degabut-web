import { IGuildMember } from "@api";
import { useQueue } from "@hooks/useQueue";
import { countedThrottle } from "@utils";
import { Component, onCleanup, onMount } from "solid-js";
import { render } from "solid-js/web";

type JamCollection = {
	requestedBy: IGuildMember;
	jams: Jam[];
};

type Jam = {
	xOffset: number;
	ySpeed: number;
	jamSpeed: number;
};

type CatJamProps = {
	requestedBy: IGuildMember;
} & Jam;

export const CatJam: Component<CatJamProps> = (props) => {
	let element!: HTMLDivElement;
	const x = () => Math.round(props.xOffset * 100);
	const url = () =>
		props.jamSpeed < 0.65
			? "/img/cat-jam-slow.gif"
			: props.jamSpeed < 0.95
			? "/img/cat-jam-fast.gif"
			: "/img/cat-jam-rainbow.gif";

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
			<img src={url()} class="w-16 h-16 mx-auto" />
			<div class="flex-row-center space-x-0.5">
				<img src={props.requestedBy.avatar || "/img/avatar.png"} class="w-4 h-4 rounded-full" />
				<div class="text-sm">{props.requestedBy.displayName}</div>
			</div>
		</div>
	);
};

export const CatJamManager: Component = () => {
	const { emitter, jam } = useQueue();

	const throttledJam = countedThrottle(jam, 350);

	onMount(() => {
		emitter.on("member-jammed", onJam);
		document.addEventListener("keydown", onKeyDown);
	});
	onCleanup(() => {
		emitter.removeListener("member-jammed", onJam);
		document.removeEventListener("keydown", onKeyDown);
	});

	const onJam = async (collection: JamCollection) => {
		const length = collection.jams.length;
		for (const j of collection.jams) {
			spawnJam({ ...j, requestedBy: collection.requestedBy });
			await new Promise((r) => setTimeout(r, 350 / length));
		}
	};

	const onKeyDown = (e: KeyboardEvent) => {
		const target = e.target as Element | null;
		const tagName = target?.tagName.toUpperCase();

		if (tagName !== "INPUT" && tagName !== "TEXTAREA" && e.key === "j") {
			e.preventDefault();
			throttledJam();
		}
	};

	const spawnJam = (jam: CatJamProps) => {
		const element = document.createElement("div");
		element.className = "fixed pointer-events-none z-[1000]";
		render(() => <CatJam {...jam} />, element);
		document.body.appendChild(element);
		setTimeout(() => element.remove(), 6000);
	};

	return <></>;
};
