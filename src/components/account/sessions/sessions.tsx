'use client'

import { Loader2 } from 'lucide-react'
import { Fragment } from 'react'

import { useGetSessionsQuery } from '@/generated/api'

import { Heading } from '../../shared/heading'

import { RemoveAllSessions } from './remove-all-sessions'
import { SessionItem } from './session-item'

export function Sessions() {
	const { data, isLoading } = useGetSessionsQuery()

	// The API sorts by last activity; the current device goes first, as before.
	const sessions =
		data && [...data].sort((a, b) => Number(b.current) - Number(a.current))

	return (
		<div className='w-full'>
			<div className='mx-auto flex h-full max-w-5xl flex-col gap-4 rounded-xl'>
				{isLoading ? (
					<div className='flex h-[75vh] items-center justify-center'>
						<Loader2 className='size-10 animate-spin text-muted-foreground' />
					</div>
				) : (
					<Fragment>
						<div className='block items-center justify-between space-y-3 md:flex md:space-y-0'>
							<Heading
								title='Устройства'
								description='Здесь отображаются устройства, с которых выполнен вход в вашу учетную запись'
							/>
							<RemoveAllSessions />
						</div>
						<div className='mt-2 space-y-5'>
							{sessions?.map(session => (
								<SessionItem
									key={session.id}
									session={session}
								/>
							))}
						</div>
					</Fragment>
				)}
			</div>
		</div>
	)
}
