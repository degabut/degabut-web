import { useParams } from "@solidjs/router";
import { useRecap } from "@user/hooks";
import { Component, For, Show } from "solid-js";
import { Card } from "./components/card.component";

export const Recap: Component = () => {
	const params = useParams<{ year: string }>();
	const recap = useRecap({ year: +params.year });

	let secondSectionRef: HTMLDivElement | undefined;

	return (
		<div class="bg-neutral-850 snap-y snap-mandatory overflow-y-scroll h-full">
			{/* first section */}
			<div class=" h-[100dvh] flex justify-center items-center snap-start relative">
				<div
					class="absolute bottom-10 h-14 w-14 rounded-full bg-white animate-bounce hover:cursor-pointer"
					onClick={() => secondSectionRef?.scrollIntoView({ behavior: "smooth" })}
				/>
				<span class="text-7xl block font-semibold text-brand -mt-20">
					Degabut <span class="text-white">2023</span> Recap
				</span>
			</div>

			{/* second section */}
			<div class=" h-[100dvh] flex justify-center items-center snap-start" ref={secondSectionRef}>
				<Show when={recap.data()} keyed>
					{(data) => (
						<div>
							<span class="text-4xl block font-semibold text-brand text-center mb-16">
								Your Most Played Songs
							</span>
							<div class="flex justify-between w-[80dvw]">
								<For each={data.mostPlayed.slice(0, 5)}>
									{(data) => (
										<Card>
											<div class="flex flex-col space-y-2">
												<img src={data.thumbnails[0].url} />
												<span>{data.title}</span>
											</div>
										</Card>
									)}
								</For>
							</div>
						</div>
					)}
				</Show>
			</div>

			{/* third section  */}
			<div class=" h-[100dvh] flex justify-center items-center snap-start">
				<span class="text-4xl block font-semibold text-brand text-center mb-16">Monthly Recap</span>
			</div>

			{/* fourth section  */}
			<div class=" h-[100dvh] flex justify-center items-center snap-start">
				<span class="text-4xl block font-semibold text-brand text-center mb-16">Quarter One Recap</span>
			</div>

			{/* fifth section  */}
			<div class=" h-[100dvh] flex justify-center items-center snap-start">
				<span class="text-4xl block font-semibold text-brand text-center mb-16">Quarter Two Recap</span>
			</div>

			{/* sixth section  */}
			<div class=" h-[100dvh] flex justify-center items-center snap-start">
				<span class="text-4xl block font-semibold text-brand text-center mb-16">Quarter Three Recap</span>
			</div>

			{/* seventh section  */}
			<div class=" h-[100dvh] flex justify-center items-center snap-start">
				<span class="text-4xl block font-semibold text-brand text-center mb-16">Quarter Four Recap</span>
			</div>

			{/* eighth section  */}
			<div class=" h-[100dvh] flex justify-center items-center snap-start">
				<span class="text-4xl block font-semibold text-brand text-center mb-16">Final Overview</span>
			</div>
		</div>
	);
};
