'use client'

import { AccountHeader } from '../account-ui'

import { Leaderboard } from './leaderboard'
import { ProgressCourses } from './progress-courses'
import { ProgressStats } from './progress-stats'

export function Progress() {
	return (
		<div className='space-y-10'>
			<AccountHeader
				title='Мой прогресс'
				description='Ваши очки, пройденные уроки и место среди других учеников.'
			/>
			<ProgressStats />
			<div className='grid gap-10 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] xl:gap-8'>
				<ProgressCourses />
				<Leaderboard />
			</div>
		</div>
	)
}
