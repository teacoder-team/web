import type { UserResponse } from '@/generated/model'

import { Card, CardContent } from '../../ui/card'

import { AvatarForm } from './avatar-form'
import { DisplayNameForm } from './display-name-form'

interface ProfileForm {
	user: UserResponse | undefined
}

export function ProfileForm({ user }: ProfileForm) {
	return (
		<div className='flex flex-col gap-y-3'>
			<h2 className='text-[19px] font-medium'>Профиль</h2>
			<Card className='shadow-none'>
				<CardContent className='p-4'>
					<div className='space-y-4'>
						<AvatarForm user={user} />
						<DisplayNameForm user={user} />
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
