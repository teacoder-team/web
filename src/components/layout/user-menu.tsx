'use client'

import { ChartArea, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'

import { useSession } from '@/lib/auth/auth-provider'
import { useSignOut } from '@/lib/auth/useSignOut'
import { ROUTES } from '@/lib/routes'

import { UserAvatar } from '../shared/user-avatar'
import { Button } from '../ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '../ui/dropdown-menu'

export function UserMenu() {
	const { user } = useSession()

	const { mutate } = useSignOut()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					className='relative size-10 rounded-full'
				>
					<UserAvatar name={user?.displayName} src={user?.avatar} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56' align='end'>
				<DropdownMenuLabel className='font-normal'>
					<div className='flex flex-col space-y-1'>
						<p className='text-sm font-medium leading-none'>
							{user?.displayName}
						</p>
						<p className='text-xs leading-none text-muted-foreground'>
							{user?.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link href={ROUTES.ACCOUNT.ROOT}>
							<ChartArea />
							Мой прогресс
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href={ROUTES.ACCOUNT.SETTINGS}>
							<Settings />
							Настройки
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => mutate()}
						className='!text-rose-600'
					>
						<LogOut />
						Выйти
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
