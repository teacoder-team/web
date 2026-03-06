type JsonLd = Record<string, unknown>;

const SITE_URL = "https://teacoder.ru";

export function websiteJsonLd(): JsonLd {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "TeaCoder",
		url: SITE_URL,
		potentialAction: {
			"@type": "SearchAction",
			target: `${SITE_URL}/search?q={search_term_string}`,
			"query-input": "required name=search_term_string",
		},
	};
}

export function courseJsonLd({
	title,
	description,
	slug,
	image,
}: {
	title: string;
	description: string;
	slug: string;
	image?: string;
}): JsonLd {
	return {
		"@context": "https://schema.org",
		"@type": "Course",
		name: title,
		description,
		url: `${SITE_URL}/courses/${slug}`,
		image,
		provider: {
			"@type": "Organization",
			name: "TeaCoder",
			sameAs: SITE_URL,
		},
	};
}
