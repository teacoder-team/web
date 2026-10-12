'use client'

import { Gem } from 'lucide-react'
import { useState } from 'react'

import { useGetUsersLeadersQuery } from '@/generated/api'

import { useMediaSource } from '@/hooks/use-media-source'

import { useSession } from '@/lib/auth/auth-provider'
import { cn } from '@/lib/utils'

import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { Button } from '../../ui/button'
import { Skeleton } from '../../ui/skeleton'
import { SettingsSection } from '../account-ui'

const PREVIEW_COUNT = 8

const PODIUM: Record<number, string> = {
	1: 'bg-warning-soft text-warning',
	2: 'bg-secondary text-foreground',
	3: 'bg-brand-soft text-brand'
}

export function Leaderboard() {
	const [isExpanded, setIsExpanded] = useState(false)

	const { user } = useSession()
	const { data, isLoading } = useGetUsersLeadersQuery()
	const getMediaSource = useMediaSource()

	const users = isExpanded ? data : data?.slice(0, PREVIEW_COUNT)
	const canExpand = (data?.length ?? 0) > PREVIEW_COUNT

	return (
		<SettingsSection title='Рейтинг'>
			{isLoading
				? Array.from({ length: 5 }).map((_, index) => (
						<div
							key={index}
							className='flex items-center gap-3 px-5 py-3.5'
						>
							<Skeleton className='size-7 rounded-full' />
							<Skeleton className='size-9 rounded-full' />
							<Skeleton className='h-4 flex-1' />
						</div>
					))
				: users?.map(leader => {
						const isMe = leader.id === user?.id

						return (
							<div
								key={leader.id}
								className={cn(
									'flex items-center gap-3 px-5 py-3',
									isMe && 'bg-brand-soft/50'
								)}
							>
								<span
									className={cn(
										'flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-xs tabular-nums',
										PODIUM[leader.rank] ??
											'text-muted-foreground'
									)}
								>
									{leader.rank}
								</span>
								<Avatar className='size-9'>
									<AvatarImage
										src={getMediaSource(
											leader.avatar,
											'users'
										)}
										alt=''
									/>
									<AvatarFallback>
										{leader.displayName.slice(0, 1)}
									</AvatarFallback>
								</Avatar>
								<div className='flex min-w-0 flex-1 items-center gap-2'>
									<span className='truncate text-sm font-medium'>
										{leader.displayName}
									</span>
									{isMe && (
										<span className='shrink-0 text-xs text-brand'>
											вы
										</span>
									)}
									{leader.isPremium && (
										<Gem
											aria-label='Premium'
											className='size-3.5 shrink-0 text-brand'
										/>
									)}
								</div>
								<span className='shrink-0 font-mono text-sm tabular-nums'>
									{new Intl.NumberFormat('ru-RU').format(
										leader.points
									)}
								</span>
							</div>
						)
					})}

			{canExpand && (
				<div className='p-3'>
					<Button
						variant='ghost'
						className='w-full'
						onClick={() => setIsExpanded(value => !value)}
					>
						{isExpanded ? 'Свернуть' : 'Показать весь рейтинг'}
					</Button>
				</div>
			)}
		</SettingsSection>
	)
}
