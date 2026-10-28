import type { CourseListResponseItemStatus } from '@/generated/model'

import type { BadgeProps } from '@/components/ui/badge'

interface CourseStatusMeta {
	label: string
	variant: NonNullable<BadgeProps['variant']>
}

/** `DRAFT` never reaches the public API, so it has no label. */
export const COURSE_STATUS: Partial<
	Record<CourseListResponseItemStatus, CourseStatusMeta>
> = {
	ANNOUNCED: { label: 'Скоро', variant: 'warning' },
	IN_PRODUCTION: { label: 'Выходит поэтапно', variant: 'default' },
	EARLY_ACCESS: { label: 'Ранний доступ', variant: 'default' },
	COMPLETED: { label: 'Курс завершён', variant: 'success' },
	PUBLICLY_RELEASED: {
		label: 'Полная версия на YouTube',
		variant: 'neutral'
	},
	ARCHIVED: { label: 'В архиве', variant: 'outline' }
}
