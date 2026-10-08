'use client'

import { SmartCaptcha } from '@yandex/smart-captcha'
import { useTheme } from 'next-themes'
import Turnstile from 'react-turnstile'

import { useAppConfig } from '@/lib/config/use-app-config'

interface CaptchaProps {
	onVerify: (token: string) => void
	onExpire?: () => void
}

export function useCaptchaRequired() {
	const { data } = useAppConfig()

	return data ? data.features.captcha.provider !== 'none' : false
}

export function Captcha({ onVerify, onExpire }: CaptchaProps) {
	const { resolvedTheme } = useTheme()
	const { data } = useAppConfig()

	const captcha = data?.features.captcha
	const theme = resolvedTheme === 'dark' ? 'dark' : 'light'

	if (!captcha?.key) {
		return null
	}

	if (captcha.provider === 'turnstile') {
		return (
			<Turnstile
				sitekey={captcha.key}
				onVerify={onVerify}
				onExpire={onExpire}
				theme={theme}
				size='flexible'
				style={{
					width: '100%'
				}}
			/>
		)
	}

	if (captcha.provider === 'yandex') {
		return (
			<div className='w-full'>
				<SmartCaptcha
					sitekey={captcha.key}
					onSuccess={onVerify}
					onTokenExpired={onExpire}
					language='ru'
					theme={theme}
				/>
			</div>
		)
	}

	return null
}
