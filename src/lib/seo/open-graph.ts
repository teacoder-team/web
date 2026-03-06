import type { Metadata } from "next";

const SITE_URL = "https://teacoder.ru";

export function createOpenGraph({
	title,
	description,
	path,
	image,
}: {
	title: string;
	description: string;
	path: string;
	image?: string;
}): Metadata["openGraph"] {
	const url = `${SITE_URL}${path}`;

	return {
		type: "website",
		url,
		title,
		description,
		siteName: "TeaCoder",
		images: [
			{
				url: image ?? `${SITE_URL}/og.png`,
				width: 1200,
				height: 630,
				alt: title,
			},
		],
	};
}

export function createTwitterCard({
	title,
	description,
	image,
}: {
	title: string;
	description: string;
	image?: string;
}): Metadata["twitter"] {
	return {
		card: "summary_large_image",
		title,
		description,
		images: image ? [image] : undefined,
	};
}
