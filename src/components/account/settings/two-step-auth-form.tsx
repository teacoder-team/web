import { KeyRound, ListOrdered, Mail, Smartphone } from 'lucide-react'

import type { MfaStatusResponse } from '@/generated/model'

import { Badge } from '../../ui/badge'
import { Card, CardContent } from '../../ui/card'

import { DisableTotpForm } from './disable-totp-form'
import { EnableTotpForm } from './enable-totp-form'
import { PasskeyModal } from './passkey-modal'
import { RecoveryCodesModal } from './recovery-codes-modal'
import { RegisterPasskeyForm } from './register-passkey-form'

interface TwoFactorAuthFormProps {
	status: MfaStatusResponse | undefined
}

export function TwoStepAuthForm({ status }: TwoFactorAuthFormProps) {
	const hasKeys = (status?.webauthn.credentials ?? 0) > 0
	const hasRecoveryCodes = (status?.recoveryCodes.total ?? 0) > 0

	return (
		<div className='flex flex-col gap-y-3'>
			<h2 className='text-[19px] font-medium'>
				Многофакторная аутентификация
			</h2>
			<Card className='shadow-none'>
				<CardContent className='p-4'>
					<div className='space-y-8'>
						<div className='flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0'>
							<div className='mr-5 flex items-start gap-x-4 md:items-center'>
								<div className='hidden rounded-full bg-blue-600 p-2.5 md:flex'>
									<Smartphone className='size-5 stroke-[1.7px] text-white' />
								</div>
								<div className='w-full'>
									<div className='mb-1 flex flex-col items-start gap-2 sm:flex-row sm:items-center'>
										<h2 className='font-semibold'>
											Приложение для аутентификации
										</h2>
										{status?.totp.enabled ? (
											<Badge variant='success'>
												Включено
											</Badge>
										) : (
											<Badge variant='error'>
												Отключено
											</Badge>
										)}
									</div>
									<p className='text-sm text-muted-foreground'>
										{status?.totp.enabled
											? 'Двухфакторная аутентификация через TOTP включена. Для входа в аккаунт используйте приложение-аутентификатор, чтобы получить код.'
											: 'Обеспечьте безопасность своего аккаунта с помощью двухфакторной аутентификации через TOTP.'}
									</p>
								</div>
							</div>
							<div>
								{status?.totp.enabled ? (
									<DisableTotpForm />
								) : (
									<EnableTotpForm />
								)}
							</div>
						</div>

						<div className='flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0'>
							<div className='mr-5 flex items-start gap-x-4 md:items-center'>
								<div className='hidden rounded-full bg-blue-600 p-2.5 md:flex'>
									<KeyRound className='size-5 stroke-[1.7px] text-white' />
								</div>
								<div className='w-full'>
									<div className='mb-1 flex flex-col items-start gap-2 sm:flex-row sm:items-center'>
										<h2 className='font-semibold'>
											Ключи доступа
										</h2>
										{/* {hasKeys ? (
											<Badge variant='success'>
												Включено
											</Badge>
										) : (
											<Badge variant='error'>
												Отключено
											</Badge>
										)} */}
									</div>
									<p className='text-sm text-muted-foreground'>
										{hasKeys
											? 'Ключ доступа добавлен как второй фактор. Вы можете использовать его для подтверждения входа.'
											: 'Добавьте ключ доступа, чтобы повысить уровень защиты аккаунта.'}
									</p>
								</div>
							</div>
							<div className='flex gap-3'>
								{hasKeys && <PasskeyModal />}
								<RegisterPasskeyForm />
							</div>
						</div>

						{hasRecoveryCodes && (
							<div className='flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0'>
								<div className='mr-5 flex items-center gap-x-4'>
									<div className='hidden rounded-full bg-blue-600 p-2.5 md:flex'>
										<ListOrdered className='size-5 stroke-[1.7px] text-white' />
									</div>
									<div className='flex w-full flex-col'>
										<h2 className='font-semibold'>
											Коды восстановления
										</h2>
										<p className='text-sm text-muted-foreground'>
											Вы можете использовать коды
											восстановления для доступа к
											аккаунту, если потеряете доступ к
											своему устройству.
										</p>
									</div>
								</div>
								<div>
									<RecoveryCodesModal />
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
