import type {
	CourseLessonListResponseItem,
	CourseResponse,
	RootResponseFeaturesPremium
} from '@/generated/model'

import { env } from '@/lib/config/env'
import { getPayablePrice } from '@/lib/utils'

import { LOGO, SEO, absoluteUrl } from './index'

export type Schema = Record<string, unknown>

const ORGANIZATION_ID = `${SEO.url}/#organization`
const WEBSITE_ID = `${SEO.url}/#website`

/** Stable node the other schemas point at instead of repeating the publisher. */
export function organizationSchema(): Schema {
	return {
		'@type': 'EducationalOrganization',
		'@id': ORGANIZATION_ID,
		name: SEO.name,
		url: SEO.url,
		description: SEO.description,
		email: env.SUPPORT_EMAIL,
		logo: {
			'@type': 'ImageObject',
			url: LOGO.url.toString(),
			width: LOGO.width,
			height: LOGO.height
		},
		image: LOGO.url.toString(),
		sameAs: SEO.social,
		areaServed: 'RU',
		knowsLanguage: SEO.language
	}
}

export function websiteSchema(): Schema {
	return {
		'@type': 'WebSite',
		'@id': WEBSITE_ID,
		url: SEO.url,
		name: SEO.name,
		description: SEO.description,
		inLanguage: SEO.language,
		publisher: { '@id': ORGANIZATION_ID }
	}
}

export function breadcrumbSchema(
	items: { name: string; path: string }[]
): Schema {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: absoluteUrl(item.path)
		}))
	}
}

/**
 * Summary page pattern: list items carry only the URL, and each course page
 * holds the full `Course` node.
 */
export function itemListSchema(
	items: { path: string }[],
	name: string
): Schema {
	return {
		'@type': 'ItemList',
		name,
		numberOfItems: items.length,
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			url: absoluteUrl(item.path)
		}))
	}
}

interface CourseSchemaInput {
	course: CourseResponse
	path: string
	program: CourseLessonListResponseItem[]
	currency: string | undefined
}

export function courseSchema({
	course,
	path,
	program,
	currency
}: CourseSchemaInput): Schema {
	const url = absoluteUrl(path)
	const price = getPayablePrice(course.price, course.discountPrice)
	const sections = program.filter(item => 'lessons' in item)
	const isFree = course.accessMode === 'FREE'

	const schema: Schema = {
		'@type': 'Course',
		'@id': `${url}#course`,
		name: course.title,
		description: course.shortDescription ?? course.fullDescription ?? '',
		url,
		inLanguage: SEO.language,
		isAccessibleForFree: isFree,
		provider: { '@id': ORGANIZATION_ID },
		publisher: { '@id': ORGANIZATION_ID },
		// Watched online, on demand: no cohort, no schedule and no fixed workload
		hasCourseInstance: {
			'@type': 'CourseInstance',
			courseMode: 'online',
			inLanguage: SEO.language
		}
	}

	if (course.thumbnail) {
		schema['image'] = course.thumbnail
	}

	if (course.learningOutcomes.length > 0) {
		schema['teaches'] = course.learningOutcomes
	}

	if (sections.length > 0) {
		schema['syllabusSections'] = sections.map((section, index) => ({
			'@type': 'Syllabus',
			name: 'lessons' in section ? section.title : '',
			position: index + 1
		}))
	}

	if (course.views > 0) {
		schema['interactionStatistic'] = {
			'@type': 'InteractionCounter',
			interactionType: 'https://schema.org/ViewAction',
			userInteractionCount: course.views
		}
	}

	if (course.youtubeUrl) {
		schema['sameAs'] = course.youtubeUrl
	}

	if (isFree) {
		schema['offers'] = {
			'@type': 'Offer',
			url,
			price: 0,
			priceCurrency: currency ?? 'RUB',
			availability: 'https://schema.org/InStock',
			category: 'Free'
		}
	} else if (course.entitlements.purchase && price !== null && currency) {
		schema['offers'] = {
			'@type': 'Offer',
			url,
			price,
			priceCurrency: currency,
			availability: 'https://schema.org/InStock',
			category: 'Paid'
		}
	}

	return schema
}

export function personSchema(): Schema {
	return {
		'@type': 'Person',
		'@id': `${SEO.url}/about#person`,
		name: 'Вадим',
		jobTitle: 'Веб-разработчик, основатель TeaCoder',
		description:
			'Основатель образовательной платформы TeaCoder и автор видеоуроков по веб-разработке.',
		url: absoluteUrl('/about'),
		sameAs: SEO.social,
		worksFor: { '@id': ORGANIZATION_ID },
		knowsAbout: [
			'Веб-разработка',
			'JavaScript',
			'TypeScript',
			'React',
			'Next.js',
			'Node.js'
		]
	}
}

export function faqSchema(items: { question: string; text: string }[]): Schema {
	return {
		'@type': 'FAQPage',
		mainEntity: items.map(item => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: { '@type': 'Answer', text: item.text }
		}))
	}
}

export function subscriptionSchema(
	premium: RootResponseFeaturesPremium | undefined,
	path: string
): Schema {
	const url = absoluteUrl(path)

	const schema: Schema = {
		'@type': 'Product',
		'@id': `${url}#premium`,
		name: `${SEO.name} Premium`,
		description:
			'Подписка открывает закрытые уроки и исходный код курсов с пометкой «По подписке».',
		url,
		image: LOGO.url.toString(),
		brand: { '@id': ORGANIZATION_ID },
		category: 'Онлайн-обучение'
	}

	if (premium) {
		schema['offers'] = {
			'@type': 'Offer',
			url,
			price: premium.prices.standard,
			priceCurrency: premium.currency,
			availability: 'https://schema.org/InStock',
			seller: { '@id': ORGANIZATION_ID },
			priceSpecification: {
				'@type': 'UnitPriceSpecification',
				price: premium.prices.standard,
				priceCurrency: premium.currency,
				billingDuration: premium.months,
				billingIncrement: 1,
				unitCode: 'MON'
			}
		}
	}

	return schema
}

/** Legal pages and other static documents. */
export function webPageSchema(
	name: string,
	description: string,
	path: string
): Schema {
	return {
		'@type': 'WebPage',
		name,
		description,
		url: absoluteUrl(path),
		inLanguage: SEO.language,
		isPartOf: { '@id': WEBSITE_ID },
		publisher: { '@id': ORGANIZATION_ID }
	}
}
