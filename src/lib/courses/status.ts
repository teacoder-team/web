import type { CourseListResponseItemStatus } from '@/generated/model'

import type { BadgeProps } from '@/components/ui/badge'

interface CourseStatusMeta {
	label: string
	variant: NonNullable<BadgeProps['variant']>
}

/** No label for `DRAFT` (never public) and `PUBLICLY_RELEASED` (deliberately not shown). */
export const COURSE_STATUS: Partial<
	Record<CourseListResponseItemStatus, CourseStatusMeta>
> = {
	ANNOUNCED: { label: 'Скоро', variant: 'warning' },
	IN_PRODUCTION: { label: 'Выходит поэтапно', variant: 'default' },
	EARLY_ACCESS: { label: 'Ранний доступ', variant: 'default' },
	COMPLETED: { label: 'Курс завершён', variant: 'success' },
	ARCHIVED: { label: 'В архиве', variant: 'outline' }
}
