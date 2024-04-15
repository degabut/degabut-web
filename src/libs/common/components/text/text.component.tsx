import type { JSX, ParentComponent } from "solid-js";

type BaseHeadlineProps = JSX.HTMLAttributes<HTMLHeadingElement> & {
	truncate?: boolean;
};

type BaseSpanProps = JSX.HTMLAttributes<HTMLSpanElement> & {
	truncate?: boolean;
	light?: boolean;
};

export const H1: ParentComponent<BaseHeadlineProps> = (props) => {
	return (
		<h1
			{...props}
			class="text-2xl font-medium"
			classList={{
				truncate: props.truncate,
				...props.classList,
				[props.class || ""]: !!props.class,
			}}
		>
			{props.children}
		</h1>
	);
};

export const H2: ParentComponent<BaseHeadlineProps> = (props) => {
	return (
		<h2
			{...props}
			class="text-xl font-medium"
			classList={{
				truncate: props.truncate,
				...props.classList,
				[props.class || ""]: !!props.class,
			}}
		>
			{props.children}
		</h2>
	);
};

export const H3: ParentComponent<BaseHeadlineProps> = (props) => {
	return (
		<h3
			{...props}
			class="text-lg font-medium"
			classList={{
				truncate: props.truncate,
				...props.classList,
				[props.class || ""]: !!props.class,
			}}
		>
			{props.children}
		</h3>
	);
};

export const H4: ParentComponent<BaseHeadlineProps> = (props) => {
	return (
		<h4
			{...props}
			class="text-base font-medium"
			classList={{
				truncate: props.truncate,
				...props.classList,
				[props.class || ""]: !!props.class,
			}}
		>
			{props.children}
		</h4>
	);
};

export const H5: ParentComponent<BaseHeadlineProps> = (props) => {
	return (
		<h5
			{...props}
			class="text-sm font-bold"
			classList={{
				truncate: props.truncate,
				...props.classList,
				[props.class || ""]: !!props.class,
			}}
		>
			{props.children}
		</h5>
	);
};

export const H6: ParentComponent<BaseHeadlineProps> = (props) => {
	return (
		<h6
			{...props}
			{...props}
			class="text-xs font-bold"
			classList={{
				truncate: props.truncate,
				...props.classList,
				[props.class || ""]: !!props.class,
			}}
		>
			{props.children}
		</h6>
	);
};

export const Body1: ParentComponent<BaseSpanProps> = (props) => {
	return (
		<span
			{...props}
			class="text-base"
			classList={{
				truncate: props.truncate,
				...props.classList,
				[props.class || ""]: !!props.class,
			}}
		>
			{props.children}
		</span>
	);
};

export const Body2: ParentComponent<BaseSpanProps> = (props) => {
	return (
		<span
			{...props}
			class="text-sm text-neutral-300"
			classList={{
				truncate: props.truncate,
				...props.classList,
				[props.class || ""]: !!props.class,
			}}
		>
			{props.children}
		</span>
	);
};

export const Caption1: ParentComponent<BaseSpanProps> = (props) => {
	return (
		<span
			{...props}
			class="text-sm"
			classList={{
				"text-neutral-300": props.light,
				"text-neutral-400": !props.light,
				truncate: props.truncate,
				...props.classList,
				[props.class || ""]: !!props.class,
			}}
		>
			{props.children}
		</span>
	);
};

export const Caption2: ParentComponent<BaseSpanProps> = (props) => {
	return (
		<span
			{...props}
			class="text-xs"
			classList={{
				"text-neutral-300": props.light,
				"text-neutral-400": !props.light,
				truncate: props.truncate,
				...props.classList,
				[props.class || ""]: !!props.class,
			}}
		>
			{props.children}
		</span>
	);
};
