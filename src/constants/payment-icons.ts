import { BitcoinIcon, CreditCardIcon, GlobeIcon, StarIcon } from 'lucide-react'
import { FaYandex } from 'react-icons/fa'
import type { ComponentType, SVGProps } from 'react'

import type { RootResponseFeaturesPaymentsItemId } from '@/generated/model'

import {
	SberbankIcon,
	SbpIcon,
	TBankIcon,
	YoomoneyIcon
} from '@/components/icons'

type IconType = ComponentType<SVGProps<SVGSVGElement>>

export const PAYMENT_METHOD_ICONS: Record<
	RootResponseFeaturesPaymentsItemId,
	IconType
> = {
	BANK_CARD: CreditCardIcon,
	SBP: SbpIcon,
	T_PAY: TBankIcon,
	SBER_PAY: SberbankIcon,
	YOOMONEY: YoomoneyIcon,
	CRYPTO_BOT: BitcoinIcon,
	HELEKET: BitcoinIcon,
	INTERNATIONAL_CARD: GlobeIcon,
	YANDEX_SPLIT: FaYandex,
	TELEGRAM_STARS: StarIcon
}
