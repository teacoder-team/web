'use client'

import { Fragment } from 'react'

import { useGetMfaQuery } from '@/generated/api'

import { useSession } from '@/lib/auth/auth-provider'

import { Heading } from '../../shared/heading'

import { AccountActions } from './account-actions'
import { AccountForm } from './account-form'
import { Preferences } from './preferences'
import { ProfileForm } from './profile-form'
import { TwoStepAuthForm } from './two-step-auth-form'

export function Settings() {
	const { user } = useSession()

	const { data: status } = useGetMfaQuery()

	return (
		<div className='w-full'>
			<div className='mx-auto flex h-full max-w-5xl flex-col gap-4'>
				<Fragment>
					<Heading
						title='Настройки аккаунта'
						description=' Управление настройками вашего аккаунта'
					/>
					<div className='mt-2 space-y-9'>
						<ProfileForm user={user} />
						<AccountForm user={user} />
						<TwoStepAuthForm status={status} />
						<Preferences />
						<AccountActions />
					</div>
				</Fragment>
			</div>
		</div>
	)
}
