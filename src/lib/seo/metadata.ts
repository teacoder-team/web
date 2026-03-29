import type { Metadata } from 'next'

import { APP } from '../constants/app'

type MetadataParams = {
	title?: string
	description?: string
	path?: string
	image?: string
	keywords?: string[]
	noIndex?: boolean
}

const DEFAULT_IMAGE = `${APP.url}/og.png`

export function createMetadata({
	title,
	description = APP.description,
	path = '',
	image = DEFAULT_IMAGE,
	keywords = [],
	noIndex = false
}: MetadataParams = {}): Metadata {
	const fullTitle = title ? `${title} | ${APP.name}` : APP.name

	const url = `${APP.url}${path}`

	return {
		title: fullTitle,
		description,
		keywords,
		metadataBase: new URL(APP.url),
		alternates: {
			canonical: url
		},
		robots: {
			index: !noIndex,
			follow: !noIndex,
			googleBot: {
				index: !noIndex,
				follow: !noIndex,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1
			}
		},
		openGraph: {
			type: 'website',
			locale: 'ru_RU',
			url,
			title: fullTitle,
			description,
			siteName: APP.name,
			images: [
				{
					url: image,
					width: 1200,
					height: 630,
					alt: fullTitle
				}
			]
		},
		twitter: {
			card: 'summary_large_image',
			title: fullTitle,
			description,
			images: [image]
		}
	}
}

export function createCourseMetadata({
	title,
	description,
	slug,
	image
}: {
	title: string
	description: string
	slug: string
	image?: string
}): Metadata {
	return createMetadata({
		title,
		description,
		path: `/courses/${slug}`,
		image
	})
}

export function createNoIndexMetadata(title: string, description?: string): Metadata {
	return createMetadata({
		title,
		description,
		noIndex: true
	})
}
