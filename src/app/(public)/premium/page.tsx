import type { Metadata } from 'next'

import { getCoursesQuery } from '@/generated/api'

import { CourseCard } from '@/components/course/course-card'
import { FAQSection } from '@/components/premium/faq'
import { getFaqs } from '@/components/premium/faq-items'
import { Premium } from '@/components/premium/premium'
import { JsonLd } from '@/components/shared/json-ld'

import { withoutSplit } from '@/lib/billing/payment-methods'
import { getAppConfig } from '@/lib/config/app-config'
import { ROUTES } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo'
import {
	breadcrumbSchema,
	faqSchema,
	subscriptionSchema
} from '@/lib/seo/schema'
import { COURSE, formatPrice, pluralize } from '@/lib/utils'

export const metadata: Metadata = pageMetadata({
	title: 'Подписка Premium',
	description:
		'Premium открывает закрытые уроки и исходный код курсов с пометкой «По подписке». Оплата картой, СБП и криптовалютой, отменить можно в любой момент.',
	path: ROUTES.PREMIUM
})

export default async function PremiumPage() {
	// The pricing block works without the course list, so a failed fetch only hides the grid
	const [courses, config] = await Promise.all([
		getCoursesQuery().catch(() => []),
		getAppConfig()
	])

	const premium = config?.features.premium
	const faqs = getFaqs(
		withoutSplit(config?.features.payments)?.map(method => method.name) ??
			[],
		premium
			? formatPrice(premium.prices.international, premium.currency)
			: null
	)
	// Subscription covers PREMIUM courses only; PURCHASE ones are bought separately
	const included = courses.filter(
		course =>
			course.accessMode === 'PREMIUM' ||
			course.accessMode === 'PREMIUM_OR_PURCHASE'
	)

	return (
		<main className='pb-24 sm:pb-32'>
			<JsonLd
				schema={[
					subscriptionSchema(premium, ROUTES.PREMIUM),
					faqSchema(faqs),
					breadcrumbSchema([
						{ name: 'Главная', path: ROUTES.HOME },
						{ name: 'Подписка', path: ROUTES.PREMIUM }
					])
				]}
			/>

			<section className='page-container pt-16 pb-14 text-center sm:pt-24 sm:pb-16'>
				<p className='inline-flex rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-muted-foreground'>
					Подписка TeaCoder
				</p>
				<h1 className='mx-auto mt-7 max-w-3xl font-display text-display-xl font-medium'>
					Все курсы по подписке
					<br />
					<span className='text-brand'>в одном плане</span>.
				</h1>
				<p className='mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground'>
					Подписка открывает закрытые уроки и исходный код курсов с
					пометкой «По подписке». Отменить можно в любой момент.
				</p>
			</section>

			<Premium />

			{included.length > 0 && (
				<section className='page-container mt-24 sm:mt-32'>
					<div className='flex flex-wrap items-end justify-between gap-4'>
						<h2 className='font-serif text-display-lg font-medium tracking-[-0.02em]'>
							Курсы в подписке
						</h2>
						<p className='text-muted-foreground'>
							{pluralize(included.length, COURSE)}
						</p>
					</div>
					<div className='mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
						{included.map(course => (
							<CourseCard key={course.id} course={course} />
						))}
					</div>
				</section>
			)}

			<div className='mt-24 sm:mt-32'>
				<FAQSection />
			</div>
		</main>
	)
}
