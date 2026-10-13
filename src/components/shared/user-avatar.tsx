import type { ComponentPropsWithoutRef } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface UserAvatarProps extends ComponentPropsWithoutRef<typeof Avatar> {
	name: string | undefined
	src: string | null | undefined
	fallbackClassName?: string
}

export function UserAvatar({
	name,
	src,
	fallbackClassName,
	...props
}: UserAvatarProps) {
	return (
		<Avatar {...props}>
			<AvatarImage src={src ?? undefined} alt='' />
			<AvatarFallback className={fallbackClassName}>
				{name?.slice(0, 1)}
			</AvatarFallback>
		</Avatar>
	)
}
