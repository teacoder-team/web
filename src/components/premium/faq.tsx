'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

import { useAppConfig } from '@/lib/config/useAppConfig'
import { ROUTES } from '@/lib/routes'
import { formatPrice } from '@/lib/utils'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '../ui/accordion'

const linkClassName =
	'text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground'

interface Faq {
	question: string
	answer: ReactNode
}

function getFaqs(
	paymentMethods: string[],
	internationalPrice: string | null
): Faq[] {
	return [
		{
			question: 'Что входит в подписку?',
			answer: (
				<>
					<p>
						Подписка открывает все курсы с пометкой «По подписке»:
						закрытые уроки, исходный код и материалы. Если у курса
						указана ещё и цена, его можно не только смотреть по
						подписке, но и купить навсегда.
					</p>
					<p className='mt-3'>
						Кроме того, подписка даёт значок{' '}
						<strong className='font-medium text-foreground'>
							Premium
						</strong>{' '}
						в таблице лидеров.
					</p>
				</>
			)
		},
		{
			question: 'Какие курсы не входят в подписку?',
			answer: (
				<p>
					Курсы, которые продаются только отдельной покупкой, - у них
					в карточке указана цена без пометки «По подписке». Купленный
					курс остаётся открытым навсегда. Бесплатные курсы доступны
					всем без подписки.
				</p>
			)
		},
		{
			question: 'Что ещё доступно по подписке?',
			answer: (
				<ul className='list-disc space-y-2 pl-5'>
					<li>
						Просмотр уроков по разделам - если программа курса
						разбита на разделы.
					</li>
					<li>Домашние задания - если они есть у курса.</li>
				</ul>
			)
		},
		{
			question: 'Как можно оплатить подписку?',
			answer: (
				<p>
					{paymentMethods.length > 0
						? `Доступные способы оплаты: ${paymentMethods.join(', ')}.`
						: 'Способ оплаты можно выбрать при оформлении подписки.'}
				</p>
			)
		},
		{
			question: 'Можно ли оплатить подписку за пределами РФ?',
			answer: (
				<p>
					Да, оплата международными банковскими картами доступна. Вы
					можете оформить подписку из любой страны. Из-за высокой
					комиссии международных платёжных систем стоимость подписки
					при оплате иностранной картой выше
					{internationalPrice ? (
						<>
							{' '}
							и составляет{' '}
							<strong className='font-medium text-foreground'>
								{internationalPrice}
							</strong>
						</>
					) : null}
					.
				</p>
			)
		},
		{
			question: 'Как и когда можно отменить подписку?',
			answer: (
				<>
					<p>
						Отменить подписку можно в любое время в разделе{' '}
						<Link
							href={ROUTES.ACCOUNT.SUBSCRIPTION}
							className={linkClassName}
						>
							«Подписка»
						</Link>{' '}
						личного кабинета.
					</p>
					<p className='mt-3'>
						После отмены доступ сохранится до конца уже оплаченного
						периода.
					</p>
				</>
			)
		}
	]
}

export function FAQSection() {
	const { data: config } = useAppConfig()

	const premium = config?.features.premium
	const faqs = getFaqs(
		config?.features.payments.map(method => method.name) ?? [],
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
