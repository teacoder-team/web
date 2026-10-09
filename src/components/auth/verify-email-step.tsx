'use client'

import { Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'

import { useCaptchaRequired } from '@/lib/captcha/captcha'

import { AuthWrapper } from './auth-wrapper'
import { CaptchaField } from './captcha-field'

interface VerifyEmailStepProps {
	email: string
	onBack: () => void
	onResend: (captchaToken?: string) => Promise<number | null>
	resendAfter?: number
}

export function VerifyEmailStep({
	email,
	onBack,
	onResend,
	resendAfter = 60
}: VerifyEmailStepProps) {
	const [remaining, setRemaining] = useState(resendAfter)
	const [isSending, setIsSending] = useState(false)
	const [captchaKey, setCaptchaKey] = useState(0)
	const isCaptchaRequired = useCaptchaRequired()
	const form = useForm<{ captcha: string }>({ defaultValues: { captcha: '' } })

	useEffect(() => {
		if (remaining <= 0) {
			return
		}

		const timer = window.setTimeout(() => setRemaining(value => Math.max(0, value - 1)), 1000)

		return () => window.clearTimeout(timer)
	}, [remaining])

	async function resend() {
		if (isSending || remaining > 0) {
			return
		}

		const captchaToken = form.getValues('captcha')

		if (isCaptchaRequired && !captchaToken) {
			toast.warning('Пройдите капчу!')

			return
		}

		setIsSending(true)

		try {
			const resendAfter = await onResend(captchaToken || undefined)

			if (resendAfter !== null) {
				setRemaining(resendAfter)
				toast.success('Письмо с подтверждением отправлено')
			}
		} catch {
			return
		} finally {
			form.reset()
			setCaptchaKey(value => value + 1)
			setIsSending(false)
		}
	}

	return (
		<AuthWrapper
			heading='Проверьте почту'
			description={'Мы отправили ссылку подтверждения на ' + email + '. Откройте письмо и перейдите по ссылке, чтобы подтвердить почту и войти.'}
		>
			<div className='grid gap-4'>
				<Mail className='mx-auto size-12 text-blue-500' aria-hidden='true' />
				<p className='text-sm text-muted-foreground'>
					Ссылка действует 30 минут. Если письма нет, проверьте папку «Спам»
					или отправьте его ещё раз. Новая ссылка заменит предыдущую.
				</p>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(resend)} className='grid gap-4'>
						{remaining === 0 && (
							<CaptchaField control={form.control} name='captcha' resetKey={captchaKey} />
						)}
						<Button type='submit' variant='primary' disabled={remaining > 0 || isSending} isLoading={isSending}>
							{remaining > 0 ? 'Отправить повторно через ' + remaining + ' с' : 'Отправить письмо ещё раз'}
						</Button>
					</form>
				</Form>
				<Button type='button' variant='outline' disabled={isSending} onClick={onBack}>
					Изменить данные
				</Button>
			</div>
		</AuthWrapper>
	)
}
