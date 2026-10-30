import type { Metadata } from 'next'

import { env } from '@/lib/config/env'

export const SEO = {
	name: 'TeaCoder',
	description:
		'Курсы по веб-разработке с практикой на реальных примерах: уроки, исходный код проектов и прогресс обучения. Изучай веб-разработку в удобном для себя ритме.',
	url: env.APP_URL,
	locale: 'ru_RU',
	language: 'ru-RU',
	keywords: [
		'веб-разработка',
		'курсы по программированию',
		'онлайн-курсы веб-разработки',
		'программирование для начинающих',
		'веб-технологии',
		'фронтенд разработка',
		'бэкенд разработка',
		'создание сайтов',
		'web development',
		'programming courses',
		'web development online courses',
		'programming for beginners',
		'web technologies',
		'frontend development',
		'backend development',
		'website creation'
	],
	/** Profiles that `sameAs` links the organization to. */
	social: [
		'https://youtube.com/@TeaCoder52',
		'https://t.me/TeaCoder_official',
		'https://github.com/teacoder-team'
	]
}

export const OG_IMAGE = {
	url: new URL('/opengraph.jpg', env.APP_URL),
	width: 2400,
	height: 1260,
	alt: 'TeaCoder - образовательная платформа по веб-разработке'
}

export const LOGO = {
	url: new URL('/touch-icons/512x512.png', env.APP_URL),
	width: 512,
	height: 512
}

export const absoluteUrl = (path: string) =>
	new URL(path, env.APP_URL).toString()

interface PageMetadataInput {
	title: string
	description: string
	/** Canonical path, always starting with `/`. */
	path: string
	/** Replaces the shared Open Graph image, e.g. with a course cover. */
	image?: { url: string; alt: string }
	keywords?: string[]
	/** Keeps the page out of the index while letting crawlers follow its links. */
	noIndex?: boolean
	openGraphType?: 'website' | 'article' | 'profile'
}

/**
 * Next applies the title template only to `title`, so Open Graph and Twitter
 * get the branded title built here.
 */
export function pageMetadata({
	title,
	description,
	path,
	image,
	keywords,
	noIndex,
	openGraphType = 'website'
}: PageMetadataInput): Metadata {
	const socialTitle = `${title} - ${SEO.name}`
	const images = image ? [{ url: image.url, alt: image.alt }] : [OG_IMAGE]

	return {
		title,
		description,
		...(keywords && { keywords }),
		alternates: { canonical: path },
		...(noIndex && { robots: { index: false, follow: true } }),
		openGraph: {
			type: openGraphType,
			url: path,
			siteName: SEO.name,
			locale: SEO.locale,
			title: socialTitle,
			description,
			images
		},
		twitter: {
			card: 'summary_large_image',
			title: socialTitle,
			description,
			images
		}
	}
}
