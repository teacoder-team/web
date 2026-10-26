import { BitcoinIcon, CreditCardIcon, GlobeIcon, StarIcon } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'
import { FaYandex } from 'react-icons/fa'

import type {
	RootResponseFeaturesPaymentsItem,
	RootResponseFeaturesPaymentsItemId
} from '@/generated/model'

import {
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

/** Methods listed in the general payment dialog: Split has its own button. */
export const withoutSplit = (options: PaymentOption[] | undefined) =>
	options?.filter(option => !isSplit(option))

/** Methods that can carry a recurring charge for the subscription. */
export const RECURRING_METHODS: string[] = ['BANK_CARD', 'SBP', 'T_PAY']

export const PAYMENT_METHOD_ICONS: Record<
	RootResponseFeaturesPaymentsItemId,
	IconType
> = {
	BANK_CARD: CreditCardIcon,
	SBP: SbpIcon,
	T_PAY: TBankIcon,
	SBER_PAY: SberbankIcon,
	YOOMONEY: YoomoneyIcon,
	CRYPTO: BitcoinIcon,
	INTERNATIONAL_CARD: GlobeIcon,
	YANDEX_SPLIT: FaYandex,
	TELEGRAM_STARS: StarIcon
}
