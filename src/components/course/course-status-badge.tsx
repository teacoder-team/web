import type { CourseListResponseItemStatus } from '@/generated/model'

import { COURSE_STATUS } from '@/lib/courses/status'

import { Badge, type BadgeProps } from '../ui/badge'

interface CourseStatusBadgeProps extends Omit<BadgeProps, 'variant'> {
	status: CourseListResponseItemStatus
}

export function CourseStatusBadge({
	status,
	...props
}: CourseStatusBadgeProps) {
	const meta = COURSE_STATUS[status]

	if (!meta) return null

	return (
		<Badge variant={meta.variant} {...props}>
			{meta.label}
		</Badge>
	)
}
