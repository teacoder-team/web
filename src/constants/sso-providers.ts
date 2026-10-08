import type { IconType } from 'react-icons'
import { FaVk, FaYandex } from 'react-icons/fa'
import { FaDiscord, FaGithub } from 'react-icons/fa6'
import { FcGoogle } from 'react-icons/fc'
import { RiTelegram2Fill } from 'react-icons/ri'

import type { OAuthAccountsResponseAccountsItemSlug } from '@/generated/model'

export type SsoProvider = OAuthAccountsResponseAccountsItemSlug

export interface SsoProviderMeta {
	id: SsoProvider
	name: string
	description: string
	icon: IconType
	color?: string
}

export const SSO_PROVIDERS: Record<SsoProvider, SsoProviderMeta> = {
	google: {
		id: 'google',
		name: 'Google',
		icon: FcGoogle,
		description: 'Настройте вход через Google для быстрой авторизации'
	},
	github: {
		id: 'github',
		name: 'GitHub',
		icon: FaGithub,
		description: 'Настройте вход через GitHub для удобной авторизации'
	},
	discord: {
		id: 'discord',
		name: 'Discord',
		icon: FaDiscord,
		description: 'Настройте вход через Discord для авторизации в 1 клик',
		color: '#5D6AF2'
	},
	telegram: {
		id: 'telegram',
		name: 'Telegram',
		icon: RiTelegram2Fill,
		description: 'Настройте вход через Telegram для быстрой авторизации',
		color: '#0088CC'
	},
	yandex: {
		id: 'yandex',
		name: 'Яндекс',
		icon: FaYandex,
		description: 'Настройте вход через Яндекс для быстрой авторизации',
		color: '#FC3F1D'
	},
	vk: {
		id: 'vk',
		name: 'Вконтакте',
		icon: FaVk,
		description: 'Настройте вход через Вконтакте для быстрой авторизации',
		color: '#0077FF'
	}
}

export function isSsoProvider(value: string): value is SsoProvider {
	return Object.hasOwn(SSO_PROVIDERS, value)
}
