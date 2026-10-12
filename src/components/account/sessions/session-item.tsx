import type { SessionListResponseItem } from '@/generated/model'

import { formatDate, getBrowserIcon } from '@/lib/utils'

import { SettingsRow } from '../account-ui'

import { RevokeSession } from './remove-session'

interface SessionItemProps {
	session: SessionListResponseItem
}

export function SessionItem({ session }: SessionItemProps) {
	const Icon = getBrowserIcon(session.friendlyName ?? '')

	const location = [session.city, session.country].filter(Boolean).join(', ')
	const details = [
		location,
		session.ip,
		session.current ? null : `вход ${formatDate(session.createdAt)}`
	]
		.filter(Boolean)
		.join(' · ')

	return (
		<SettingsRow
			icon={<Icon />}
			title={session.friendlyName ?? 'Неизвестное устройство'}
			badge={
				session.current && (
					<span className='inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-xs font-medium leading-none text-success'>
						<span className='size-1.5 rounded-full bg-success' />
						Это устройство
					</span>
				)
			}
			description={details}
		>
			{!session.current && <RevokeSession id={session.id} />}
		</SettingsRow>
	)
}
