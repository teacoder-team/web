export function formatDate(date: string | Date): string {
	const createdAt = new Date(date)
	const formattedDate = new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: 'long',
		hour: '2-digit',
		minute: '2-digit'
	}).format(createdAt)

	const [day, month, year, time] = formattedDate.split(' ')

	return `${day} ${month} в ${time}`
}

/** "2 ноября 2026" - without the "г." suffix, so it reads inside a sentence. */
export function formatFullDate(date: string | Date): string {
	return new Intl.DateTimeFormat('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	})
		.format(new Date(date))
		.replace(/\s*г\.$/, '')
}

/** Calendar days left; 0 once the date has passed. */
export function daysUntil(date: string | Date): number {
	const diff = new Date(date).getTime() - Date.now()

	return Math.max(0, Math.ceil(diff / 86_400_000))
}
