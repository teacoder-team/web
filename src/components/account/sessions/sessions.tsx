'use client'

import { useGetSessionsQuery } from '@/generated/api'

import {
	AccountHeader,
	SettingsRowSkeleton,
	SettingsSection
} from '../account-ui'

import { RemoveAllSessions } from './remove-all-sessions'
import { SessionItem } from './session-item'

export function Sessions() {
	const { data, isLoading } = useGetSessionsQuery()

	// The API sorts by last activity; the current device goes first, as before.
	const sessions =
		data && [...data].sort((a, b) => Number(b.current) - Number(a.current))
	const hasOthers = (sessions?.length ?? 0) > 1

	return (
		<div className='space-y-8 sm:space-y-10'>
			<AccountHeader
				title='Устройства'
				description='Устройства, с которых выполнен вход в ваш аккаунт. Завершите сеанс, если не узнаёте устройство.'
				action={hasOthers && <RemoveAllSessions />}
			/>
			<SettingsSection>
				{isLoading
					? Array.from({ length: 3 }).map((_, index) => (
							<SettingsRowSkeleton key={index} />
						))
					: sessions?.map(session => (
							<SessionItem key={session.id} session={session} />
						))}
			</SettingsSection>
		</div>
	)
}
