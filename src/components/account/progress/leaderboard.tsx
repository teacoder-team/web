'use client'

import { ChevronRightIcon, GemIcon, TrophyIcon, UsersIcon } from 'lucide-react'

import { useGetUsersLeadersQuery } from '@/generated/api'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import { useMediaSource } from '@/hooks/use-media-source'

import { cn } from '@/lib/utils'

import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'

interface LeaderboardProps {
	limit?: number
	showButton?: boolean
	onViewAll?: () => void
}

export function Leaderboard({
	limit,
	showButton,
	onViewAll
}: LeaderboardProps) {
	const { data } = useGetUsersLeadersQuery()
	const getMediaSource = useMediaSource()

	const users = limit ? data?.slice(0, limit) : data

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center text-lg font-medium'>
					<UsersIcon className='mr-2 size-5' /> Рейтинг пользователей
				</CardTitle>
				<CardDescription>
					Пользователи с наибольшим количеством очков
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{users?.map((user, index) => {
						const position = user.rank

						return (
							<div
								key={index}
								className='flex items-center justify-between rounded-md p-2'
							>
								<div className='flex items-center'>
									<div className='w-8 text-center text-[15px] font-semibold'>
										{position === 1 && (
											<TrophyIcon className='mx-auto size-5 text-yellow-500' />
										)}
										{position === 2 && (
											<TrophyIcon className='mx-auto size-5 text-gray-400' />
										)}
										{position === 3 && (
											<TrophyIcon className='mx-auto size-5 text-amber-700' />
										)}
										{position > 3 && position}
									</div>
									<div className='ml-4 flex items-center gap-4'>
										<Avatar>
											<AvatarImage
												src={getMediaSource(
													user.avatar,
													'users'
												)}
												alt={user.displayName}
											/>
											<AvatarFallback>
												{user?.displayName.slice(0, 1)}
											</AvatarFallback>
										</Avatar>

										<div className='flex items-center gap-2'>
											<p className='font-medium'>
												{user.displayName}
											</p>
											{user.isPremium && (
												<span className='flex items-center gap-1 rounded-full bg-blue-100 px-2 py-[3px] text-xs font-medium text-blue-600'>
													<GemIcon className='size-3 text-blue-500' />
													Premium
												</span>
											)}
										</div>
									</div>
								</div>
								<div className='font-medium'>
									{user.points} очков
								</div>
							</div>
						)
					})}
				</div>
			</CardContent>
			{showButton && (
				<CardFooter>
					<Button
						variant='outline'
						className='w-full'
						onClick={onViewAll}
					>
						Посмотреть полный рейтинг{' '}
						<ChevronRightIcon className='ml-2 size-4' />
					</Button>
				</CardFooter>
			)}
		</Card>
	)
}
