'use client'

import { withoutSplit } from '@/lib/billing/payment-methods'
import { useAppConfig } from '@/lib/config/useAppConfig'
import { formatPrice } from '@/lib/utils'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '../ui/accordion'

import { getFaqs } from './faq-items'

export function FAQSection() {
	const { data: config } = useAppConfig()

	const premium = config?.features.premium
	const faqs = getFaqs(
		withoutSplit(config?.features.payments)?.map(method => method.name) ??
			[],
		premium
			? formatPrice(premium.prices.international, premium.currency)
			: null
	)

	return (
		<section className='page-container max-w-3xl'>
			<h2 className='text-center font-display text-display-lg font-medium'>
				Вопросы и ответы
			</h2>

			<Accordion
				type='single'
				collapsible
				className='mt-10 border-t border-border'
			>
				{faqs.map((faq, index) => (
					<AccordionItem
						key={index}
						value={`faq-${index}`}
						className='border-b border-border'
					>
						<AccordionTrigger className='text-left text-lg'>
							{faq.question}
						</AccordionTrigger>
						<AccordionContent className='pb-6 text-base leading-relaxed text-muted-foreground'>
							{faq.answer}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</section>
	)
}
