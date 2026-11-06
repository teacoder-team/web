import { BitcoinIcon, CreditCardIcon, GlobeIcon, StarIcon } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'
import { FaYandex } from 'react-icons/fa'

import type {
	RootResponseFeaturesPaymentsItem,
	RootResponseFeaturesPaymentsItemId
} from '@/generated/model'

import {
	AlfaIcon,
	SberbankIcon,
	SbpIcon,
	TBankIcon,
	YoomoneyIcon
} from '@/components/icons'

type IconType = ComponentType<SVGProps<SVGSVGElement>>

/** Yandex Split pays a course in equal parts and never applies to the subscription. */
export const SPLIT_PARTS = 4
export const SPLIT_MONTHS = 2

type PaymentOption = RootResponseFeaturesPaymentsItem

export const isSplit = (option: PaymentOption) => option.id === 'YANDEX_SPLIT'

export const findSplit = (options: PaymentOption[] | undefined) =>
	options?.find(isSplit)

/** Methods the subscription cannot use, whatever the API offers. */
const COURSE_ONLY_METHODS = new Set<string>(['ALFA_PAY'])

/**
 * Methods listed in the payment dialog: Split always has its own button, and
 * course-only methods drop out when the subscription is being paid for.
 */
export const payableMethods = (
	options: PaymentOption[] | undefined,
	isSubscription: boolean
) =>
	options?.filter(
		option =>
			!isSplit(option) &&
			!(isSubscription && COURSE_ONLY_METHODS.has(option.id))
	)

/** Methods that can carry a recurring charge for the subscription. */
export const RECURRING_METHODS: string[] = ['BANK_CARD', 'SBP', 'T_PAY']

const PAYMENT_METHOD_ICONS: Partial<
	Record<RootResponseFeaturesPaymentsItemId, IconType>
> = {
	BANK_CARD: CreditCardIcon,
	SBP: SbpIcon,
	T_PAY: TBankIcon,
	SBER_PAY: SberbankIcon,
	ALFA_PAY: AlfaIcon,
	YOOMONEY: YoomoneyIcon,
	CRYPTO: BitcoinIcon,
	INTERNATIONAL_CARD: GlobeIcon,
	YANDEX_SPLIT: FaYandex,
	TELEGRAM_STARS: StarIcon
}

/** A method the backend adds before the frontend knows it still gets an icon. */
export const getPaymentIcon = (id: RootResponseFeaturesPaymentsItemId) =>
	PAYMENT_METHOD_ICONS[id] ?? CreditCardIcon
