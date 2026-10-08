import type { SessionListResponseItem } from '@/generated/model'

import { formatDate, getBrowserIcon } from '@/lib/utils'

import { Card, CardContent } from '../../ui/card'

import { RevokeSession } from './remove-session'

interface SessionItemProps {
	session: SessionListResponseItem
}

export function SessionItem({ session }: SessionItemProps) {
	const Icon = getBrowserIcon(session.friendlyName ?? '')

	const isCurrentSession = session.current
	const location = [session.city, session.country].filter(Boolean).join(', ')

	return (
		<Card className='shadow-none'>
			<CardContent className='flex items-center justify-between p-4'>
				<div className='flex items-center gap-x-3'>
					<div className='rounded-full bg-blue-600 p-2.5'>
						<Icon className='size-5 text-white' />
					</div>
					<div>
						<h2 className='font-semibold'>
							{session.friendlyName ?? 'Неизвестное устройство'}
						</h2>
						<p className='text-sm text-muted-foreground'>
							{isCurrentSession && (
								<span className='mr-1 inline-flex items-center'>
									<span className='relative mr-2 flex size-2'>
										<span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
										<span className='relative inline-flex size-2 rounded-full bg-emerald-500' />
									</span>
									<span className='text-emerald-500'>
										Текущее устройство
									</span>
									<span className='ml-2 mr-1'>•</span>
								</span>
							)}
							{location}
							{!isCurrentSession && (
								<> • {formatDate(session.createdAt)}</>
							)}
						</p>
					</div>
				</div>
				{!isCurrentSession && <RevokeSession id={session.id} />}
			</CardContent>
		</Card>
	)
}
